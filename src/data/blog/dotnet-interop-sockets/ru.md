---
title: ".NET Interop на примере работы с сокетами"
slug: "dotnet-interop-sockets"
date: 2009-01-19
description: "Как скрестить ежа с ужом: используем P/Invoke и DllImport для работы с нативными Windows Sockets из .NET-приложения."
lang: "ru"
tags: [".NET", "Interop", "сокеты", "программирование"]
---

*Хватит мне уже гнать про теорию, вы мне практику давайте, практику!*

У нас есть множество технологий. Одни неимоверно быстры, другие неимоверно удобны. Одни позволяют летать со скоростью света, другие позволяют разрабатывать со скоростью света.

Споры насчёт того, какой же подход лучше, утихают редко. Сейчас я покажу, как можно скрестить ежа с ужом. У нас есть .NET, которым можно быстро делать, и есть Native, который может быстро делать.

В образовательных целях мы будем скрещивать эти два направления. У статьи есть ещё одна цель. В её основе лежит написанная мною и Arwyl'ом программа под названием DuSter. Эта программа представляет собой сервер-пустышку, который позволяет тестировать сетевые программы. Сервер очень прост в использовании, достаточно гибко настраивается, поддерживает файлы описания протоколов, которые позволяют более-менее автоматизировать тестирование работы любых протоколов. Я занимался разработкой сетевого уровня, мой друг — бизнес-логикой и парсингом протоколов. Получилось что-то неимоверно хорошо вылизанное и приятное. Мы гордимся своей программой и хотим предоставить её исходники миру для некоммерческого использования.

### Основы

Существует CLR — Common Language Runtime, среда, которая позволяет выполнять программы, написанные на языках, поддерживающих CLI (Common Language Infrastructure). Всё это дело плюс компиляторы и библиотеки образует .NET Framework, одну из самых распространённых сред разработки в мире. Я не буду рассказывать о том, как работают программы, написанные на .NET, поскольку эта тема достойна ещё пары статей. Скажу лишь основную вещь, необходимую для нашей статьи. Машинный код .NET и машинный код Native-приложений — это не одно и то же. Соответственно, выходит интересная штука: мы можем взять одно Native-приложение, написанное на Assembler, и взять другое Native-приложение, написанное на Pascal, и скрестить их вместе. Это достаточно просто — нам давали такое задание в универе.

Я, следуя своей любопытной натуре, решил выпендриться. Я решил скрещивать Assembler и C#. Я думал, что всё будет просто — возьму, да и впишу в C# код ассемблера. Как же я ошибался. Естественно, узнав про то, что такое MSIL, я понял, что затея была не лучшая, но сдаваться не хотелось. Я долго искал выход из этой ситуации — и нашёл: P/Invoke через DllImport.

### Постановка задачи

Итак, мы имеем программу на .NET, которая работает с использованием среды исполнения .NET. Задача — сделать так, чтобы среда исполнения дёргала внешние библиотеки. Ещё немного усложним задачу — пусть программа позволит работать с сокетами на основе Windows Socket 2.0.

> Когда у нас в институте было сетевое программирование, нас заставляли писать с использованием WS2, но мы, как заядлые шарписты, воротили нос от этой библиотеки, так как в сравнении с `System.Net.Sockets` WS2 — это жалкая пародия на код. Мы долго искали компромиссы с нашим преподом и в итоге пришли к следующему: нам позволяют использовать .NET при условии, что WS2 мы будем дёргать через DllImport.

### Импорт функций

Приступим и сразу перейдём к разбору кода:

```csharp
[DllImport("ws2_32.dll", CharSet = CharSet.Auto, SetLastError = true)]
public static extern Int32 accept(Int32 socketHandle, ref SocketAddres socketAddress, ref Int32 addressLength);

[DllImport("ws2_32.dll", CharSet = CharSet.Auto, SetLastError = true)]
public static extern Int32 bind(Int32 socketHandle, ref SocketAddres socketAddress, Int32 addressLength);

[DllImport("ws2_32.dll", CharSet = CharSet.Auto, SetLastError = true)]
public static extern Int32 listen(Int32 socket, Int32 queue);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 WSAStartup(Int16 wVersionRequested, ref WSADATA lpWSAData);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern String inet_ntoa(Int32 inadr);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 inet_addr(String addr);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 WSACleanup();

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 WSAGetLastError();

[DllImport("ws2_32.dll", SetLastError = true, CharSet = CharSet.Ansi)]
public static extern Int32 gethostbyname(String name);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 socket(Int32 af, Int32 type, Int32 protocol);

[DllImport("ws2_32.dll", SetLastError = true)]
public static extern Int32 closesocket(Int32 socket);
```

Это код на C#, он делает простую и очевидную вещь. Обращаясь к стандартной для Windows библиотеке `ws2_32.dll`, он импортирует указатели на вышеприведённые методы в .NET. То есть, с виду получается следующее — я позволяю своей программе использовать Native-методы.

### Обработка ошибок

Что меня всегда раздражало в библиотеке WS2 — так это способы возвращения ошибок и чтения информации. Я очень опасливо отношусь к методам, которые возвращают значение прочитанных байт и `-1` в случае ошибки. Тем более мне не нравится после получения `-1` делать `GetLastError`, чтобы понять, в чём была ошибка. Механизм раскрутки стека исключений, который присутствует в .NET, намного больше удовлетворяет моим эстетическим требованиям.

> **Замечание:** Такой способ обработки ошибок — это специфика WinAPI. В нём все (или большинство) функции возвращают коды ошибок, в том числе через HRESULT, 0, -1. А `GetLastError` — это как раз системная функция, созданная для того, чтобы понять, что собственно произошло. Переход на обработку ошибок через исключения — это одна из ключевых особенностей платформы .NET.

### Константы и маршалинг

Следующий шаг — привести механизм работы с сокетами на уровень .NET-приложений. Для начала соберём все константы, которые есть в Native-приложениях, в enum'ы:

```csharp
enum ADDRESS_FAMILIES : short
{
    /// <summary>
    /// Unspecified [value = 0].
    /// </summary>
    AF_UNSPEC = 0,
    /// <summary>
    /// Local to host (pipes, portals) [value = 1].
    /// </summary>
    AF_UNIX = 1,
    ...
}
```

Далее — методы, экспортированные нами из WS2, работают с переменными, которых не существует в среде .NET. Поэтому необходимо было немного поизвращаться с технологией маршалинга, чтобы свести концы с концами:

```csharp
[StructLayout(LayoutKind.Sequential)]
public struct SocketAddres
{
    public Int16 sin_family;
    public UInt16 sin_port;
    public Int32 sin_addr;

    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 8)]
    public String sin_zero;
}
```

Эта структура позволяет вам оперировать адресом удалённого хоста.

### Класс NSocket

В результате мы имеем полный импорт библиотеки WS2 в .NET. Это круто, но мы сочли это недостаточным, потому что пользоваться этой библиотекой жутко неудобно. Поэтому, имея под рукой WS2-методы, мы начали разрабатывать класс `NSocket`. Первым шагом было создание наипростейшего класса исключений — потому что работа с сетью проблемами полнится, и сообщать об этих проблемах необходимо разработчику. А в .NET самый лучший способ сообщить об ошибке — это кинуть Exception:

```csharp
/// <summary>
/// Класс обработки исключения сокета
/// </summary>
public class NSocketException : System.Net.Sockets.SocketException
```

Для основной работы написано ещё два класса — `NSocket` и `NNet`. Если класс `NNet` больше заточен для работы с сетью, то `NSocket` представляет собой объектно-ориентированное представление сокета (то, чего больше всего не хватает в WS2).

Вот один из методов класса `NNet`, который позволяет принять входящее соединение:

```csharp
/// <summary>
/// Принять входящее соединение на данном сокете.
/// </summary>
/// <param name="bindedSocket">Привязанный сокет</param>
/// <returns>Указатель на подключившийся сокет</returns>
public static NSocket Accept(NSocket bindedSocket)
{
    WS2_NET.SocketAddres n = new WS2_NET.SocketAddres();
    Int32 toref = Marshal.SizeOf(n);
    NSocket s = new NSocket(WS2_NET.accept((Int32)bindedSocket, ref n, ref toref));
    s.Connected = true;
    return s;
}
```

А это конструктор класса `NSocket`, который инициализирует новый экземпляр сокета:

```csharp
/// <summary>
/// Создание нового сокета.
/// Сокет будет автоматически создан для IPv4.
/// </summary>
/// <param name="type">Тип сокета</param>
/// <param name="proto">Протокол сокета</param>
public NSocket(NSocketType type, NProtocol proto)
{
    if (this.Disposed)
        throw new InvalidOperationException("Component is disposed");

    socket = WS2_NET.socket(2, (Int32)type, (Int32)proto); // 2 = AF_INET

    if (this.HasError)
        throw new NSocketException(WS2_NET.WSAGetLastError());

    this.Closed = false;
    this.Protocol = proto;
    this.SocketType = type;
}
```

### Результат

Да, признаться честно — я не очень-то хорошо тогда разбирался в .NET, поэтому в реализации классов есть кое-какие огрехи. Но в общем — мы создали с нуля работу с сокетами за одну неделю не очень напряжённой работы. Следует учесть, что здесь мы проследили эволюционный путь от Native WS2 к .NET Objects.

Действительно, задача является несколько невостребованной, потому что в .NET существуют не только отличные классы работы с сокетами, но и классы, реализующие серверы и клиенты популярных протоколов. Я уже не говорю о такой штуке, как WCF — одного из столпов .NET 3.0, который позволяет связывать программы по сети, не требуя знаний о сокетах. Но для целей этих гигантов, которые избавляют сетевых программистов от проблем, трудятся забытые всеми WS2. Изучить их было бы неплохо — чисто для понимания.

В реальной программе, которую мы вам отдаём, кода в десятки раз больше. Мы очень старались и писали комментарии к каждому методу, чтобы во всём этом можно было разобраться.

В итоге работа с сокетами превратилась в песню:

```csharp
try
{
    NetModule.NNet.StartWS();

    if (CurrExemp.SocketProtocol == NetModule.NProtocol.Tcp)
        CurrExemp.Socket = new NetModule.NSocket(NetModule.NSocketType.Stream, CurrExemp.SocketProtocol);
    else
        CurrExemp.Socket = new NetModule.NSocket(NetModule.NSocketType.Datagram, CurrExemp.SocketProtocol);

    CurrExemp.Socket.Bind(CurrExemp.Port);

    if (CurrExemp.SocketProtocol == NetModule.NProtocol.Tcp)
        CurrExemp.Socket.Listen();
}
catch
{
    if (CurrExemp.ClientSocket != null && CurrExemp.ClientSocket.Connected)
        CurrExemp.ClientSocket.Close();

    if (CurrExemp.Socket != null && CurrExemp.Socket.Binded)
        CurrExemp.Socket.Close();

    if (NetModule.NNet.Started)
        NetModule.NNet.StopWS();

    MessageBox.Show("Can't create socket on specified port!");
    return;
}
```

Данный код показывает, как просто запустить новый сервер для протоколов TCP или UDP. Нет необходимости проводить множество проверок, которые нужны для WS2.

### Применение

Используя информацию из этой статьи, вы можете начать создавать свои приложения, которые, например, будут использовать библиотеку OpenGL. Хотя, нет, не стоит — такая библиотека уже существует.

Можно попытаться ускорить ваше приложение, используя вычисления на ассемблере. MASM32 — восхитительный пакет для работы на асме под Windows. Он позволяет экспортировать ваш код на ассемблере в виде стандартных библиотек, которые вы можете подключить в свои .NET-приложения.

Ещё можно написать программу для взаимодействия с COM-портами или USB-интерфейсами, с ядром на C/C++ и лицом на C#. Я думаю, многие согласятся, что программировать интерфейсы на C# намного удобнее, чем на чистом C.

Ну вот, это и есть мой рассказ о том, как можно скрестить ежа с ужом.

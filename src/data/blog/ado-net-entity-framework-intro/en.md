---
title: "ADO.NET Entity Framework: A Hands-On Introduction"
slug: "ado-net-entity-framework-intro"
date: 2008-12-15
description: "A practical introduction to ADO.NET Entity Framework — from creating a data model to performing basic CRUD operations in ASP.NET."
lang: "en"
tags: [".NET", "Entity Framework", "programming"]
---

*Dedicated to those who write queries in their page code...*

Hello everyone!

There's been a bit of information floating around about ADO.NET Entity Framework coming in the next version of Visual Studio 2008. (I'll let you in on a secret — that version is already out.) This development is a universal framework that lets you create the data logic for your project in just a couple of mouse clicks.

Up until now, working with data logic, I'd encountered two kinds of projects. The first were built on the well-known NHibernate framework; the others implemented data logic by hand. I've been writing and developing various systems for three years, and throughout that entire time I've been building data access logic exclusively by hand.

Then, the other day, after installing a fresh copy of Windows, I downloaded Visual Studio Web Developer Express and was pleased to discover ADO.NET Entity Framework included in the package. Shortly after, I registered a domain, set up a simple website, and began honing my skills writing programs for this framework.

### Getting Started

I was a bit unpleasantly surprised that most articles about ADO.NET EF were narrowly focused. It was impossible to find complete information, from start to finish, on how to properly set up a database, create entities, and perform basic operations on those entities. Most articles only cover one of these topics. So, while learning, I decided to share my experience with you. At the same time, using my code you won't be able to build a full business process management system, but you'll understand which end to approach things from.

First, you need to create a simple Web project with a database. It's a good idea to connect to the database right away through the Database Explorer — it'll be more convenient later.

After that, you need to add a new item to the project — **ADO.NET Entity Data Model**. You'll need to specify a connection string for the database and indicate where the first ADO.NET EF model will come from. In my database I already had two very simple tables — `Post` and `User`, so without overthinking it, I had the system generate a model based on my DB.

### The Generated Code

After all these very simple steps, I got a working DB model. Moreover, after examining this model visually, I didn't forget to look into the code and see how the framework describes all my classes:

```csharp
namespace DataBaseCore
{
    /// <summary>
    /// There are no comments for DbModel in the schema.
    /// </summary>
    public partial class DbModel : global::System.Data.Objects.ObjectContext
    {
        /// <summary>
        /// Initializes a new DbModel object using the connection string
        /// found in the 'DbModel' section of the application configuration file.
        /// </summary>
        public DbModel() :
            base("name=DbModel", "DbModel")
        {
            this.OnContextCreated();
        }

        /* Trimmed for brevity */

        [global::System.Data.Objects.DataClasses.EdmEntityTypeAttribute(
            NamespaceName="DataBaseCore", Name="Post")]
        [global::System.Runtime.Serialization.DataContractAttribute(IsReference=true)]
        [global::System.Serializable()]
        public partial class Post : global::System.Data.Objects.DataClasses.EntityObject
        {
            /// <summary>
            /// Create a new Post object.
            /// </summary>
            /// <param name="id">Initial value of Id.</param>
            public static Post CreatePost(int id)
            {
                Post post = new Post();
                post.Id = id;
                return post;
            }
        }
    }
}
```

A trained eye for data logic immediately spotted a fairly simple and elegant class that allowed working with both posts and users in the system.

### Entity Data Source

So, we've got the code — now we just need to start using it. And here's where all the beauty and capabilities of ASP.NET open up. Among the numerous data sources available for the page, I spotted the Entity Data Source, which happily provides data on demand from our class. We drag it onto the form, fire up the configuration wizard, and quickly hook the datasource up to our posts table. The datasource description in ASPX code became much more pleasant to look at:

```xml
<asp:EntityDataSource ID="dsPosts" runat="server"
    ConnectionString="name=DbModel"
    DefaultContainerName="DbModel" EntitySetName="Post">
</asp:EntityDataSource>
```

You could say it's the epitome of elegance.

Once we have a data provider on the form, we need a consumer too. Without overcomplicating things, I added some simple code that just displays all posts sequentially:

```xml
<asp:Repeater runat="server" ID="repPosts" DataSourceID="dsPosts">
    <HeaderTemplate>
    </HeaderTemplate>
    <ItemTemplate>
        <div>
            <h3>
                <asp:Label ID="lblHeader" runat="server"
                    Text='<%# Eval("Header") %>'></asp:Label>
            </h3>
            <p>
                <asp:Label ID="lblText" runat="server"
                    Text='<%# Helpers.TypographText(Eval("Text").ToString()) %>'></asp:Label>
            </p>
        </div>
    </ItemTemplate>
</asp:Repeater>
```

### Writing the Code

And this is where the easy part of my story ends. Up to this point, everything we did could be accomplished with a mouse. It was pretty straightforward. We just created an object-oriented representation of our DB and, using that representation, started displaying data from the database on a page. In the process, we never wrote a single query, never fetched data from the database directly, and so on.

But what do we show the user if there's nothing in the DB? That's no good. We need to write a form to populate the database. Now we'll put the mouse-programming aside and get down to writing actual code.

I implemented two of the most basic operations for working with posts in the system — adding and deleting. Implementing editing by analogy with this code shouldn't be difficult for anyone:

```csharp
namespace DBW
{
    public class Post
    {
        public Post()
        {
        }

        public static void New(String PostText, String PostHeader, Int32 UserId)
        {
            DataBaseCore.DbModel m = new DataBaseCore.DbModel();
            DataBaseCore.Post p = new DataBaseCore.Post();
            p.Header = PostHeader;
            p.Text = Helpers.TypographText(PostText);
            p.PublishDate = DateTime.Now;
            p.User = (from usr in m.User
                      where usr.Id == UserId
                      select usr).First();
            m.AddToPost(p);
            m.SaveChanges();
        }

        public static void Delete(Int32 PostId)
        {
            DataBaseCore.DbModel m = new DataBaseCore.DbModel();
            DataBaseCore.Post p = new DataBaseCore.Post();
            p = (from pst in m.Post
                 where pst.Id == PostId
                 select pst).First();
            m.DeleteObject(p);
            m.SaveChanges();
        }
    }
}
```

### The Nuances

It might seem like everything's simple, and yes, it is. But there are a couple of nuances.

First — it's LINQ. You can't get anywhere in ADO.NET EF without it. So don't slack off and don't give up on SQL or LINQ — you'll still have to write queries.

Second — this code is auto-generated by the framework, so don't expect total convenience in every aspect. You should always be ready to modify the code that Visual Studio created. For example, on line 16 it would have been more convenient to use a user ID directly rather than a user object that I had to fetch from the DB. That would be more convenient for this code, but it's not universal. So the code needs refinement and rethinking. Perhaps you should just pass a user object rather than a user identifier.

### What's Next?

I'll continue writing the project, diving deeper into the depths of ADO.NET Entity Framework, and I'll be happy to share my discoveries. Accordingly, there will be new articles with more serious and in-depth content.

**UPDATE:** The topic is vast. Not even one percent of the capabilities have been covered here, but there will be more to come.

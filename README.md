App is in developemnt, it's not ready yet.
-----------

Description
-----------
Tool for organizing thoughts (notes), storing them in tree structure.
Instead of database, I use filesystem:
Every note (thought) is represented by directory with "thought.txt" file inside. This is like a usual filesystem, but every directory has a thought (note, description). In Brain you can attach folders and files to your "thoughts", this done simply by putting files in the thought's directory.

For example:
Brain
 |..Projects
   |..MyOwnBlog
      |..thought.txt
      |..TodoList
        |..thought.txt
      |__Articles
        |__MyFavouriteCarsDesign
          |__thought.txt
          |__Pictures
             |__thought.txt
             |__lamborgidiMurchelago.jpg
  |_.....
  
  This files are parsed and displayed as a mind map. You store the same files, but you organize them as mind map in Brain, and it takes care of creating the corresponding file tree, which is at the same time it's database.

The main aim is to create ultimate notebook, which will store all your life's notes, and allows to "google" through them.
Every thought or note, gets a score, when it is viewed ("refreshed in memory"). Movements between thoughts are also recorded, and adds score to link between thoughts. Rarely viewed notes will have low score and considered "deep memory".
Search engine will crawl the Brain graph, starting with highest score thoughts and links. Results should be displayed asynchronously, showing user high-score thoughts with strongest linked thoughts, refreshing his memory in process of search. User can stop the crawler searcher if it gets close to what is being searched.

Brain uses Electron.io for multiplatform support.

Project is having only it's first steps thought, alsmost nothing is developed yet.

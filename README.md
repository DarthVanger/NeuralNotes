App is in developemnt, it's not ready yet (more precisely, only being planned to be developed... :)
-----------

Description
-----------
Tool for organizing thoughts (notes), storing them in tree structure.
Instead of database, I use filesystem:
Every note (thought) is represented by directory with "thought.txt" file inside. This is like a usual filesystem, but every directory has a thought (or call it a note, a description). In Brain you can attach folders and files to your "thoughts", this done simply by putting files in the thought's directory.

For example:  
Brain (root folder)
>Projects (folder)  
>>MyOwnBlog (folder)  
>>>thought.txt (file with 'MyOwnBlog' folder description)  
>>>TodoList (folder)  
>>>>thought.txt (file with todo list text)  

>Articles (folder)  
>>MyFavouriteCarsDesign (folder)  
>>>thought.txt (file with 'MyFavouriteCarsDesign' folder description)  
>>>Pictures (folder)  
>>>>thought.txt (file with 'Pictures' folder description)  
>>>>lamborgidiMurchelago.jpg  
             
>.....  
  
  This files are parsed and displayed as a mind map. You store the same files, but you organize them as mind map in Brain, and it takes care of creating the corresponding file tree, which is at the same time it's database.

The main aim is to create ultimate notebook, which will store all your life's notes, and allows to "google" through them.
Every thought or note, gets a score, when it is viewed ("refreshed in memory"). Movements between thoughts are also recorded, and adds score to link between thoughts. Rarely viewed notes will have low score and considered "deep memory".

Search engine will traverse the Brain graph, starting with highest score thoughts and links. The process of search would be continiously displayed to user (instead of the 'loading...' icon), showing high-score thoughts together with strongest linked thoughts, allowing user to refresh his memory in process of search. User can stop the search when he sees that search engine is close enough to what is being searched.

So the search would be not just the search results, but visualization of the search process, similar to how we, humans, trying to remember something by traveling in mind through some chain of associated memories.

Brain is going to use Electron.io, PhoneGap, or something similar, to be multiplatform javascript app, storing it's data locally and syncing with cloud file storage like Google Drive.

Project is having only it's first steps though, alsmost nothing is developed yet.

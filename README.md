Neural Notes
-----------
App to work with notes & files in a mind map view.

The files are saved to Google Drive.

There is no DB, it's just files:
- every node on mind map is a folder
- basically it's a folder tree displayed as a mind map

## Launch locally
```
git clone https://github.com/DarthVanger/NeuralNotes.git
cd NeuralNotes
npm install
npm start # launches a server at localhost:3000
```

## Idea
The files stored on Google Drive are parsed and displayed as a mind map. You store the same files, but you organize them as mind map in NeuralNotes, and it takes care of creating the corresponding file tree, which is at the same time it's database.

The main aim is to create ultimate notebook, which will store all your life's notes, and allows to "google" through them.
Every thought or note, gets a score, when it is viewed ("refreshed in memory"). Movements between thoughts are also recorded, and adds score to link between thoughts. Rarely viewed notes will have low score and considered "deep memory".

Search engine will traverse the NeuralNotes graph, starting with highest score thoughts and links. The process of search would be continiously displayed to user (instead of the 'loading...' icon), showing high-score thoughts together with strongest linked thoughts, allowing user to refresh his memory in process of search. User can stop the search when he sees that search engine is close enough to what is being searched.

So the search would be not just the search results, but visualization of the search process, similar to how we, humans, trying to remember something by traveling in mind through some chain of associated memories.

NeuralNotes is going to use Ionic, Electron.io, PhoneGap, or something similar, to be multiplatform javascript app, storing it's data locally and syncing with cloud file storage like Google Drive.

Project is having only it's first steps though, alsmost nothing is developed yet :)

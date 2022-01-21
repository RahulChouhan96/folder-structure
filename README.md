# Folder Structure App

This is the complete backend for this app. I have built it using Node.js, Express, Mongoose etc.



## About

This app consists of various files-folders functionalities like creating, editing names, deletion of files and folders at nested level, searching etc.


## Install packages

Once you clone this repository, enter into the folder and run command `npm install`. It must install all the packages listed in `package.json` file.


## Connect MongoDB Database

I have used MongoDB database to store the data. Create a database in your local environment (You can use a GUI tool Robo 3T). Name it `practice`.


## Run App

Run `node server.js` to start the server.


## API Docs

### Folder Routes

1. POST `/folders/folder`

Description - Creates a folder

Request - 

```js
{
    "folderName": "folder 21",
    "_parent": "61e9a359fccfbc2d72f75469"
}
```

Response - 

```js
{
    "folderName": "folder 21",
    "files": [],
    "folders": [],
    "path": [
        "61e9a359fccfbc2d72f75469"
    ],
    "deleted": false,
    "_id": "61e9f5e1859047d0914b7527",
    "__v": 1
}
```


2. GET `/folders/folder/size/:folderId`

Description - Gets total size of an entire folder. It includes all the subfolders and files nested at any level in the given folder

Params - `folderId: String`

Response - 

```js
{
    "folderSize": 6894756
}
```


3. PATCH `/folders/delete/folder/:folderId`

Description - Soft deletes a folder and all of its subfolders and files present inside at any level nested.

Params - `folderId: String`

Response - 

```js
{
    "deleted": true
}
```


4. PATCH `/folders/resume/folder/:folderId`

Description - Resume a deleted folder and all content inside it (files and folders).

Params - `folderId: String`

Response - 

```js
{
    "Resumed": true
}
```


5. PATCH `/folders/rename/folder/:folderId`

Description - Rename a folder

Params - `folderId: String`

Body - 

```js
{
    "newFolderName": "Folder 111 v2"
}
```

Response - 

```js
{
    "message": "Updated!"
}
```


6. PATCH `/folders/change/folder/location`

Description - Change location of a folder and any subfolders and files locations also changes to new destination.

Body - 

```js
{
    "fromFolderId": "61e9a353fccfbc2d72f75467",     // _id of current folder
    "toFolderId": "61e9a359fccfbc2d72f75469",       // _id of destination folder
    "folderId": "61e9a376fccfbc2d72f7546b"          // _id of the folder
}
```

Response - 

```js
{
    "message": "Location changed!",
    "updatedFolder": {
        "_id": "61e9a376fccfbc2d72f7546b",
        "folderName": "folder 11",
        "files": [
            "61e9a3cefccfbc2d72f7547b",
            "61e9a3d7fccfbc2d72f7547f"
        ],
        "folders": [
            "61e9a396fccfbc2d72f75473"
        ],
        "path": [
            "61e9a359fccfbc2d72f75469"
        ],
        "__v": 1,
        "deleted": false
    },
    "subFolders": [
        {
            "_id": "61e9a396fccfbc2d72f75473",
            "path": [
                "61e9a359fccfbc2d72f75469",
                "61e9a376fccfbc2d72f7546b"
            ]
        }
    ],
    "subFiles": [
        {
            "_id": "61e9a3cefccfbc2d72f7547b",
            "path": [
                "61e9a359fccfbc2d72f75469",
                "61e9a376fccfbc2d72f7546b"
            ],
            "updatedAt": "2022-01-20T22:31:39.546Z",
            "__v": 1
        },
        {
            "_id": "61e9a3d7fccfbc2d72f7547f",
            "path": [
                "61e9a359fccfbc2d72f75469",
                "61e9a376fccfbc2d72f7546b"
            ],
            "updatedAt": "2022-01-20T22:31:41.498Z",
            "__v": 1
        }
    ]
}
```


### File Routes

1. POST `/files/file`

Description - Create a file.

Body - 

```js
{
    "fileName": "File 12",
    "format": "jpeg",
    "size": 2298252,
    "_parent": "61e9a353fccfbc2d72f75467"
}
```

Response - 

```js
{
    "fileName": "File 12",
    "size": 2298252,
    "format": "jpeg",
    "path": [
        "61e9a353fccfbc2d72f75467"
    ],
    "deleted": false,
    "_id": "61e9fec3859047d0914b752d",
    "createdAt": "2022-01-21T00:30:59.581Z",
    "updatedAt": "2022-01-21T00:30:59.656Z",
    "__v": 1
}
```


2. POST `/files/github/info`

Description - Get JSON data from github, stores into file and add file details to Database.

Response - 

```js
{
    "fileName": "mralexgray",
    "size": 155458,
    "format": "json",
    "path": [],
    "deleted": false,
    "_id": "61e9c8181524ff1b38872811",
    "createdAt": "2022-01-20T20:37:44.072Z",
    "updatedAt": "2022-01-20T20:37:44.072Z",
    "__v": 0
}
```


3. PATCH `/files/change/file/location`

Description - Change location of file from one folder to another.

Body - 

```js
{
    "fromFolderId": "61e9a396fccfbc2d72f75473",     // Current folder _id
    "toFolderId": "61e9a359fccfbc2d72f75469",       // Destination folder _id
    "fileId": "61e9a419fccfbc2d72f7548b"            // File _id
}
```

Response - 

```js
{
    "_id": "61e9a419fccfbc2d72f7548b",
    "fileName": "File 1111",
    "size": 2298252,
    "format": "jpeg",
    "path": [
        "61e9a359fccfbc2d72f75469"
    ],
    "createdAt": "2022-01-20T18:04:09.363Z",
    "updatedAt": "2022-01-20T21:21:41.290Z",
    "__v": 1,
    "deleted": true
}
```


4. GET `/files/search/file`

Description - Search a file with its name or format. Also get the full path of this file from root.

Query - `{ fileName: "File 122" }`

Response - 

```js
{
    "_id": "61e9a406fccfbc2d72f75487",
    "fileName": "File 122",
    "size": 2298252,
    "format": "jpeg",
    "path": [
        {
            "folderName": "folder 1"
        },
        {
            "folderName": "folder 12"
        }
    ],
    "createdAt": "2022-01-20T18:03:50.785Z",
    "updatedAt": "2022-01-20T18:03:50.791Z",
    "__v": 1,
    "deleted": false,
    "fullPath": "/folder 1/folder 12/File 122.jpeg"
}
```


5. GET `/files`

Description - Get list of all files reverse sorted with date.

Response - 

```js
[
    {
        "_id": "61e9fec3859047d0914b752d",
        "fileName": "File 12",
        "size": 2298252,
        "format": "jpeg",
        "path": [
            "61e9a353fccfbc2d72f75467"
        ],
        "deleted": false,
        "createdAt": "2022-01-21T00:30:59.581Z",
        "updatedAt": "2022-01-21T00:30:59.656Z",
        "__v": 1
    },
    {
        "_id": "61e9c8181524ff1b38872811",
        "fileName": "mralexgray",
        "size": 155458,
        "format": "json",
        "path": [],
        "deleted": false,
        "createdAt": "2022-01-20T20:37:44.072Z",
        "updatedAt": "2022-01-20T20:37:44.072Z",
        "__v": 0
    },
    ...so on
]
```
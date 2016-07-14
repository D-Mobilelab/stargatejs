// UTILITIES FUNCTION
function createFile(folder, name){
    return new Promise(function(resolve, reject){
        window.resolveLocalFileSystemURL(folder,
            function(dirEntry){
                dirEntry.getFile(name, { create: true }, resolve);
            }, reject
        );
    });
}

function createFileWithContent(folder, name, content){
    return createFile(folder, name).then(function(fileEntry){
        return new Promise(function(resolve, reject){
            fileEntry.createWriter(function(fw){
                    fw.seek(fw.length);
                    var blob = new Blob([content], { type: 'text/plain' });
                    fw.write(blob);
                    fw.onwriteend = function(){
                        resolve(fileEntry);
                    };
            });
        });
    });
}

function removeFile(filepath){
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(filepath,
            (fileEntry) => {
                fileEntry.remove((result) => {
                    resolve(result === null || result === 'OK');
                });
            }, reject);
    });            
}

function createDir(root, folder){
    return new Promise(function(resolve, reject){
        window.resolveLocalFileSystemURL(root, function(rootDirEntry){
            rootDirEntry.getDirectory(folder, { create: true }, function(createdFolderEntry){
                resolve(createdFolderEntry);
            }, reject);
        }, reject);
    });
}

module.exports = {
    createDir: createDir,
    createFile: createFile,
    createFileWithContent: createFileWithContent,
    removeFile: removeFile
};
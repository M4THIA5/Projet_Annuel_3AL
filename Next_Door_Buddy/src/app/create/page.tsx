'use client'


function createDataInMySQL(){
    fetch('http://localhost:3001/postgre/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: 'John Doe'
        })
    }).then(
        response => response.json()
    ).then(
        data => alert("Done (mySQL) ! Data inserted: " + data)
    ).catch(
        error => alert(error)
    )
}

function createDataInMongoDB(){
    fetch('http://localhost:3001/mongo/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: 'Data i guess',
        })
    }).then(
        response => response.json()
    ).then(
        data => alert("Done (mongoDB) ! Data inserted: " + data)
    ).catch(
        error => alert(error)
    )
}


export default function Create(){
    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <h1>Hello, i dont have the will to update boostrap components to tailwind so this will be the create
                page </h1>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                onClick={() => createDataInMongoDB()}
            >
                Create in mongoDB
            </button>
            <button
                className="btn btn-primary"
                onClick={() => createDataInMongoDB()}
            >
                Create in mongoDB
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                onClick={() => createDataInMySQL()}
            >
                Create in MySQL
            </button>
        </div>
    )
}

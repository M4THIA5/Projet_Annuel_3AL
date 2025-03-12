"use client";
import {Data} from "../types";
import {useEffect, useState} from "react";
import Form from "next/form";

function DataGeneratedAsRow(props: { loading: boolean, data: Data[] }) {

    if (props.loading) {
        return <tr>
            <td colSpan={2}>Loading...</td>
        </tr>
    }
    const data = Array.from(props.data);
    console.log(data)
    return (
        data.length === 0 ? <tr>
                <td colSpan={2} className="border border-gray-400 px-4 py-2">No data</td>
            </tr> :
            data.map(
                (data) => (
                    <tr key={data.id}>
                        <td className="border border-gray-400 px-4 py-2">{data.id}</td>
                        <td className="border border-gray-400 px-4 py-2">{data.data}</td>
                    </tr>
                )
            )
    )
}

export default function See() {
    const [mySQLData, setMySQLData] = useState({});
    const [mongoDBData, setMongoDBData] = useState({});
    const [isMongoLoading, setMongoLoading] = useState(true);
    const [isMySqlLoading, setMySqlLoading] = useState(true);

    useEffect(() => {
        async function fetchDataForMongoDB() {
            try {
                await fetch('http://localhost:3001/mongo/get', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(r => r.json().then(data => {
                    setMongoDBData(data);
                    setMongoLoading(false);
                }));
            } catch (error) {
                setMongoLoading(false);
                setMongoDBData([]);
                console.log(error);
            }
        }

        async function fetchDataForMySQL() {
            try {
                await fetch('http://localhost:3001/mysql/get', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(r => r.json().then(data => {
                        setMySQLData(data);
                        console.log();
                        setMySqlLoading(false);
                    })
                );
            } catch (error) {
                setMySqlLoading(false);
                setMySQLData([]);
                console.log(error);
            }
        }

        fetchDataForMySQL()
        fetchDataForMongoDB()
    }, []);

    return (
        <div className={`h-screen flex flex-col items-center justify-center`}>
            <h1>Hello, i dont have the will to update boostrap components to tailwind so this will be the see page </h1>
            <div>
                <div>
                    <h3>MongoDB</h3>
                    <table className={"border-collapse border-2 border-gray-500"}>
                        <thead>
                        <tr>
                            <th className={"border border-gray-400 px-4 py-2 text-gray-800"}>Id</th>
                            <th className={"border border-gray-400 px-4 py-2 text-gray-800"}>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        <DataGeneratedAsRow loading={isMongoLoading} data={isMongoLoading ? [] : mongoDBData}/>
                        </tbody>
                    </table>
                </div>
                <div>
                    <h3>MySQL</h3>
                    <table className={"border-collapse border-2 border-gray-500"}>
                        <thead>
                        <tr>
                            <th className={"border border-gray-400 px-4 py-2 text-gray-800"}>Id</th>
                            <th className={"border border-gray-400 px-4 py-2 text-gray-800"}>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        <DataGeneratedAsRow loading={isMySqlLoading} data={isMySqlLoading ? [] : mySQLData}/>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
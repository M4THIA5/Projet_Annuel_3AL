import {useSocket} from "#/components/SocketProvider";
import {useEffect} from "react";

export default function Canvas() {
    const socket = useSocket();
    useEffect(() => {
        if (!socket) {
            console.log("Socket not ready yet");
            return;
        }
        console.log("Socket instance: ", socket);

        socket.on('connect', () => {
            console.log("Connected to server with ID: ", socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error("Connection failed: ", err);
        });
        const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
        let curColor = document.querySelector('option[aria-selected=true]')?.innerHTML ?? "black";

        const selector = document.getElementById("selectColor")
        console.log(selector)
        if (myCanvas) {
            let isDown = false;
            const ctx = myCanvas.getContext("2d");
            let canvasX: number, canvasY;
            ctx!.lineWidth = 5;

            myCanvas.addEventListener(
                "mousedown", (function (e: { pageX: number; pageY: number; }) {
                    isDown = true;
                    ctx!.beginPath();
                    canvasX = e.pageX - myCanvas.offsetLeft;
                    canvasY = e.pageY - myCanvas.offsetTop;
                    ctx!.moveTo(canvasX, canvasY);
                    socket.emit('draw', {x: canvasX, y: canvasY, color: curColor});
                    console.log("start")
                }))
            myCanvas.addEventListener(
                "mousemove", (function (e: { pageX: number; pageY: number; }) {
                    if (isDown != false) {
                        canvasX = e.pageX - myCanvas.offsetLeft;
                        canvasY = e.pageY - myCanvas.offsetTop;
                        ctx!.lineTo(canvasX, canvasY);
                        ctx!.strokeStyle = curColor;
                        ctx!.stroke();
                        socket.emit('drawing', {x: canvasX, y: canvasY, color: curColor});
                        console.log("drawibng")
                    }
                }))
            myCanvas.addEventListener(
                "mouseup", (function () {
                    isDown = false;
                    ctx!.closePath();
                    socket.emit('drawEnd');
                    console.log("alldone")
                }));
            socket.on('draw', function (data) {
                ctx!.beginPath();
                ctx!.moveTo(data.x, data.y);
                console.log("gotDraw")
            });
            socket.on('drawing', function (data) {
                ctx!.lineTo(data.x, data.y);
                ctx!.strokeStyle = data.color;
                ctx!.stroke();
                console.log("man draws wow")
            });
            socket.on('drawEnd', function () {
                ctx!.closePath();
                console.log("stooop")
            });
        }


        selector!.addEventListener("change", function (e) {
            const inputText = e.target!.value;
            curColor = inputText;
        });

    }, [socket]);

    return (
        <div id="board">
            <canvas id="myCanvas" width="850px" height="850px">
                Sorry, your browser doesn&#39;t support canvas technology.
            </canvas>
            <p>Color picker: <select id="selectColor">
                <option id="colBlack" value="black" aria-selected={"true"}>Black</option>
                <option id="colRed" value="red">Red</option>
                <option id="colBlue" value="blue">Blue</option>
                <option id="colGreen" value="green">Green</option>
                <option id="colOrange" value="orange">Orange</option>
                <option id="colYellow" value="yellow">Yellow</option>
            </select>
            </p>
        </div>
    );
}

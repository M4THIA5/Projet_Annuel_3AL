type BoardPoint = {
    row: number;
    col: number;
};

type Tetrimino = "I" | "O" | "T" | "S" | "Z" | "J" | "L";
type TetriminoRotationTestName =
    | "0>>1"
    | "1>>2"
    | "2>>3"
    | "3>>0"
    | "0>>3"
    | "3>>2"
    | "2>>1"
    | "1>>0";
type TetriminoRotationTestsBattery = {
    [key in TetriminoRotationTestName]: Array<[number, number]>;
};
type TetriminoRotationTests = {
    [key in Tetrimino]: TetriminoRotationTestsBattery;
};
type TetriminoPosition = [BoardPoint, BoardPoint, BoardPoint, BoardPoint];

type BoardCell = {
    tetrimino: Tetrimino | null;
};

type BoardRow = [
    BoardCell,
    BoardCell,
    BoardCell,
    BoardCell,
    BoardCell,
    BoardCell,
    BoardCell,
    BoardCell,
    BoardCell,
    BoardCell
];

type Board = [
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow,
    BoardRow
];

type TetriminoRotation = 0 | 1 | 2 | 3;

type ActiveTetrimino = {
    type: Tetrimino;
    rotation: TetriminoRotation;
    position: TetriminoPosition;
    projectedPlacePosition: TetriminoPosition;
};

type TetrisCallbackName =
    | "onMove"
    | "onRotate"
    | "onHardDrop"
    | "onSRSTrick"
    | "onGameOver"
    | "onPlace"
    | "onClear"
    | "onTetris";

type TetrisCallbacks = { [key in TetrisCallbackName]: () => void | null };

type GameState = {
    started: boolean;
    gameOver: boolean;
    scoreId: string | null;
    level: number;
    levelProgress: number;
    callbacks: TetrisCallbacks;
    score: number;
    lockDelay: boolean;
    fastDrop: boolean;
    activeTetrimino: ActiveTetrimino;
    placedTetriminos: Board;
    nextTetriminos: Tetrimino[];
};
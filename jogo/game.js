export default function createGame() {
    const state = {
        players: {},
        fruits: {}
    };

    const observers = []

    function subscribe(functionObcerver){
        observers.push(functionObcerver)
    }

    function notifyAll(command){
        console.log(`$$$notify number: ${observers.length} : ${command.type}`)

        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    function removeAllSubscribe(){
        observers.length = 0;
    }

    const acceptedMoves = {
        ArrowUp(player) {
            if (player.y > 0) player.y--;
        },
        ArrowDown(player) {
            if (player.y + 1 < 10) player.y++;
        },
        ArrowLeft(player) {
            if (player.x > 0) player.x--;
        },
        ArrowRight(player) {
            if (player.x + 1 < 10) player.x++;
        }
    }

    function setState(newState) {
        Object.assign(state, newState)
    }

    function movePlayer(command) {
        console.log(`funcao: moveplayer command: `)
        console.dir(command)
        console.dir(state)
        const { keyPressed, playerId } = command;
        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];

        if (moveFunction && player) {
            moveFunction(player);
            checkForFruitCollision(player);
            notifyAll({type: 'move', player: {player, playerId}, play: keyPressed})
        }

        console.dir(state)
    }

    function relocatePlayerCorendas(command){
        const { playerId } = command;
        const playerFromCommand = command.player

        if (playerFromCommand && state.players[playerId]) {
            state.players[playerId] = playerFromCommand
        }
    }

    function addPlayer(command) {
        const { playerId, playerX, playerY } = command;
        console.log(`Player ID: ${playerId}, X: ${playerX}, Y: ${playerY}`);
        console.log("merda da funcao")
        console.dir(state)

        if (playerId && playerX != null && playerY != null && !state.players[playerId]) {
            state.players[playerId] = { x: playerX, y: playerY, pontes: 0 };
            notifyAll({type: 'add-player', player: state.players[playerId], playerId})
        }
    }

    function removePlayer(command) {
        const { playerId } = command;

        if (playerId) {
            delete state.players[playerId];
            notifyAll({type: 'remove-player', playerId})
        }
    }

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * 10)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * 10)

        if (fruitId && fruitX != null && fruitY != null && !state.fruits[fruitId]) {
            state.fruits[fruitId] = { x: fruitX, y: fruitY };
            notifyAll({type: 'add-fruit', fruitId, fruitX, fruitY})
        }
    }

    function removeFruit(command) {
        const { fruitId } = command;

        if (fruitId) {
            delete state.fruits[fruitId];
            notifyAll({type: 'remove-fruit', fruitId})
        }
    }

    function checkForFruitCollision(player) {
        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];
            if (fruit.x === player.x && fruit.y === player.y) {
                removeFruit({ fruitId });
                player.pontes++;
            }
        }
    }

    function start(frequency){
        setInterval(addFruit, frequency)
    }

    return {
        state,
        observers,
        start,
        movePlayer,
        relocatePlayerCorendas,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        checkForFruitCollision,
        setState,
        subscribe,
        notifyAll,
        removeAllSubscribe
    };
}
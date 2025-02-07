export default function createListenerKeydown() {
    const observers = [];

    function subscribe(observerFunction) {
        if (!observers.includes(observerFunction)) {
            observers.push(observerFunction);
        }
    }

    function notifyAll(command) {
        console.log(`notify number: ${observers.length}`)

        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key;

        const command = {
            playerId: 999,
            keyPressed
        }

        notifyAll(command)
    }

    return { subscribe, notifyAll };
}

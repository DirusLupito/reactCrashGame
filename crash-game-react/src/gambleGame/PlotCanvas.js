import React, { useEffect, useRef, useState } from 'react';

const PlotCanvas = ({ balance, setBalance }) => {
    const canvasRef = useRef(null);
    const [gambleBalance, setGambleBalance] = useState(0);
    const [multiplier, setMultiplier] = useState(1.00);
    const [buyInAmount, setBuyInAmount] = useState('');
    const [gameState, setGameState] = useState('roundOver'); // 'roundOngoing', 'roundOver'
    const [textColor, setTextColor] = useState('red');

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        const updateCanvas = () => {
            // Clear the canvas
            ctx.clearRect(0, 0, width, height);

            // Set background color
            ctx.fillStyle = '#C7D3BF';
            ctx.fillRect(0, 0, width, height);

            // Write the multiplier inside the gray box
            ctx.fillStyle = textColor;
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(multiplier.toFixed(2) + 'x', width / 2, height / 2);
        };

        updateCanvas();
    }, [multiplier, textColor]);

    useEffect(() => {
        let interval;
        if (gameState === 'roundOngoing') {
            interval = setInterval(() => {
                if (Math.random() < 0.01) { // value * 100 percent chance
                    handleGameEnd();
                } else {
                    setMultiplier(prevMultiplier => prevMultiplier + 0.01 * prevMultiplier); // Increase by 1% of the current multiplier
                }
            }, 100);
        } else if (gameState === 'roundOver') {
            const timeout = setTimeout(() => {
                setGameState('roundOngoing');
                setTextColor('green');
            }, 10000); // 10 seconds

            return () => clearTimeout(timeout);
        }

        return () => clearInterval(interval);
    }, [gameState]);

    const handleGameEnd = () => {
        console.log('crash, eradicated ' + gambleBalance + ' dollars');
        setMultiplier(1);
        setTextColor('red');
        setGambleBalance(0);
        setGameState('roundOver');
    }

    const handleBuyIn = () => {
        const amount = parseFloat(buyInAmount);
        if (!isNaN(amount) && amount > 0 && amount <= balance) {
            setBalance(balance - amount);
            setGambleBalance(gambleBalance + amount);
            setBuyInAmount('');
        }
    };

    const handleAllIn = () => {
        if (balance > 0) {
            setGambleBalance(gambleBalance + balance);
            setBalance(0);
        }
    };

    const handleSell = () => {
        if (gambleBalance > 0) {
            const sellAmount = gambleBalance * multiplier;
            setBalance(balance + sellAmount);
            console.log(`Sold!`);
            setGambleBalance(0);
            setMultiplier(1); // Reset multiplier after selling
        }
    };

    return (
        <div>
            <canvas ref={canvasRef} width={500} height={500} />
            <div>
                <input
                    type="number"
                    value={buyInAmount}
                    onChange={(e) => setBuyInAmount(e.target.value)}
                    placeholder="Enter buy-in amount"
                />
                <button onClick={handleBuyIn} disabled={gameState !== 'roundOver'}>Buy In</button>
                <button onClick={handleAllIn} disabled={gameState !== 'roundOver'}>All In</button>
                <button onClick={handleSell}>Sell</button>
            </div>
            <div>
                <p>Balance: ${balance.toFixed(2)}</p>
                <p>Gamble Balance: ${gambleBalance.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default PlotCanvas;

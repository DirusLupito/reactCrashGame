import React, { useEffect, useRef, useState } from 'react';

const PlotCanvas = ({ balance, setBalance }) => {
    const canvasRef = useRef(null);
    const [gambleBalance, setGambleBalance] = useState(0);
    const [multiplier, setMultiplier] = useState(1.00);
    const [buyInAmount, setBuyInAmount] = useState('');
    const [previousBuyInAmount, setPreviousBuyInAmount] = useState(null);
    const [gameState, setGameState] = useState('roundOver'); // 'roundOngoing', 'roundOver'
    const [textColor, setTextColor] = useState('red');
    const [targetMultiplier, setTargetMultiplier] = useState('');
    const [autoSellEnabled, setAutoSellEnabled] = useState(false);
    const [loanAmount, setLoanAmount] = useState(0);

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

    // Handles increasing the multiplier
    useEffect(() => {
        let interval;
        if (gameState === 'roundOngoing') {
            interval = setInterval(() => {
                setMultiplier(prevMultiplier => prevMultiplier + 0.01 * prevMultiplier);
            }, 100);
        }

        return () => clearInterval(interval);
    }, [gameState]);

    // Handles crashing
    useEffect(() => {
        if (gameState === 'roundOngoing') {
            if (Math.random() < 0.01) { // value * 100 percent chance
                handleGameEnd();
            }
        } else if (gameState === 'roundOver') {
            const timeout = setTimeout(() => {
                setGameState('roundOngoing');
                setTextColor('green');
            }, 10000); // 10 seconds

            return () => clearTimeout(timeout);
        }
    }
    , [multiplier]);

    // Handles autosell
    useEffect(() => {
        if (autoSellEnabled && targetMultiplier && multiplier >= parseFloat(targetMultiplier)) {
            handleSell();
        }
    }, [multiplier]);

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
            setPreviousBuyInAmount(amount);
            setBuyInAmount('');
        }
    };

    const handleQuickBuyIn = () => {
        if (previousBuyInAmount && previousBuyInAmount <= balance) {
            setBalance(balance - previousBuyInAmount);
            setGambleBalance(gambleBalance + previousBuyInAmount);
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
        }
    };

    const handleTakeLoan = () => {
        const loan = 100; // Fixed loan amount
        setBalance(balance + loan);
        setLoanAmount(loanAmount + loan);
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
                <button onClick={handleQuickBuyIn} disabled={gameState !== 'roundOver' || !previousBuyInAmount}>Quick buy in at previous amount</button>
                <button onClick={handleTakeLoan}>Take 100 dollar Loan</button>
            </div>
            <div>
                <input
                    type="number"
                    value={targetMultiplier}
                    onChange={(e) => setTargetMultiplier(e.target.value)}
                    placeholder="Enter target multiplier"
                />
                <button onClick={() => setAutoSellEnabled(!autoSellEnabled)}>
                    {autoSellEnabled ? 'Disable Auto-Sell' : 'Enable Auto-Sell'}
                </button>
            </div>
            <div>
                <p>Balance: ${balance.toFixed(2)}</p>
                <p>Gamble Balance: ${gambleBalance.toFixed(2)}</p>
                <p>Loan Amount: ${loanAmount.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default PlotCanvas;

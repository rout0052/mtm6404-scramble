const GameOverScreen = ({ resetHandler, playerStats, highScore, modalStatus }) => {
    const [points, passes, strikes] = playerStats;
    
    const playerRank = () => {
        if(points.value == 0) {
            return 'Commoner';
        } else if(points.value != 0 && points.value <= 10) {
            return 'Novice';
        } else if(points.value > 10 && points.value <= 20) {
            return 'Apprentice';
        } else if(points.value > 20 && points.value <= 30) {
            return 'Initiate'
        } else if(points.value > 30 && points.value <= 40) {
            return 'Adept'
        } else if(points.value > 40 && points.value <= 50) {
            return 'Magus'
        } else if(points.value > 50 && points.value <= 59) {
            return 'Archmage'
        } else if(points.value == 60) {
            return 'Legendary'
        }

    }

    return (
        <div className={`modal ${modalStatus ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card has-text-centered">
                <header className="modal-card-head is-block is-shadowless pb-0">
                    <h2 className="modal-card-title is-size-1 is-family-code is-uppercase has-text-weight-extrabold mb-2">Game Over</h2>
                    <p className="subtitle is-size-3"><strong>Rank:</strong> {playerRank()} {points.value !== 0 ? 'Scramblemancer' : ''}</p>
                </header>
                <section className="modal-card-body">
                    
                    <h3 className="is-size-3 has-text-weight-medium mb-2">Player Stats:</h3>
                    
                    {playerStats.map(stat => (
                        <p className=" is-size-5 " key={stat.key}>
                            <strong>{stat.name}: </strong>
                            {stat.value}
                        </p>
                        
                    ))}

                    <h4 className="is-size-4 mt-6"><span className="has-text-weight-extrabold">Your Highscore: </span>{highScore.value} {highScore.new ? <span className="tag is-success">New</span> : ''}</h4>


                </section>
                <footer className="modal-card-foot is-flex is-justify-content-center">
                    <button onClick={resetHandler} className="button is-info">Want to play again? Start Over! </button>                    
                </footer>
            </div>
        </div>
    )
}

export default GameOverScreen;
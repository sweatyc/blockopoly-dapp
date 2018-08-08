import React from 'react'
import LandPotAuctionContract from '../build/contracts/LandPotAuction.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import './css/main.css'

// const BOARD_ROWS = 6;
const BOARD_COLUMNS = 7;
const DOUBLE_POS = [3, 8, 12, 29, 33, 38];
const TRIPPLE_POS = [16, 18, 23, 25];
const POINTS_POS = [0, 6, 35, 41];
var END_DATE = new Date("Aug 8, 2018 0:0:0");

function Square(props) {
    const myId = props.id;
    let className = "square";
    let team;
    let info;
    if (props.isSelected) {
        className += " square-select";
    }
    if (props.bidState) {
        const teamName = props.bidState.team;
        className += " " + teamName;
        team = teamName.split("-")[1];
    }
    if (myId === 0 || myId === 6 || myId === 35 || myId === 41) {
        info = "+10";
    } else if (myId === 3 || myId === 8 || myId === 12 || myId === 29 || myId === 33 || myId === 38) {
        info = "x2";
    } else if (myId === 16 || myId === 18 || myId === 23 || myId === 25) {
        info = "x3";
    }
    return (
        <button className={className} onClick={props.onClick}>
            {team}
            <span className="square-info">{info}</span>
        </button>
    );
}

function Navbar(props) {
    return (
        <div>
            <nav className="topnav">
                <a href="#">Block 42</a>
                <div>
                    <button className="withdraw" onClick={props.Onclick}>Withdraw</button>
                </div>
                <div>
                    <img  src='eth.png' alt="Bid Pool:"/>{props.pool}
                </div>

            </nav>
        </div>
    );
}

function TeamScore(props) {
    const className = "team-icon " + props.team;
    const score = props.score;
    const teamTag = props.team.split("-")[1];
    let divClass = "team-score";
    if (props.selectTeam === props.team) {
        divClass += " square-select";
    }
    return (
        <div className={divClass}>
            <div className={className} onClick={props.onClick}>{teamTag}</div>
            <p className="team-score-text">Score: {score}</p>
        </div>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                selectId={this.props.selectId}
                isSelected={this.props.selectId === i}
                bidState={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                id={i}
            />
        );
    }

    render() {
        return (
            <div className="gridboard">
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                </div>
                <div className="board-row">
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                    {this.renderSquare(9)}
                    {this.renderSquare(10)}
                    {this.renderSquare(11)}
                    {this.renderSquare(12)}
                    {this.renderSquare(13)}
                </div>
                <div className="board-row">
                    {this.renderSquare(14)}
                    {this.renderSquare(15)}
                    {this.renderSquare(16)}
                    {this.renderSquare(17)}
                    {this.renderSquare(18)}
                    {this.renderSquare(19)}
                    {this.renderSquare(20)}
                </div>
                <div className="board-row">
                    {this.renderSquare(21)}
                    {this.renderSquare(22)}
                    {this.renderSquare(23)}
                    {this.renderSquare(24)}
                    {this.renderSquare(25)}
                    {this.renderSquare(26)}
                    {this.renderSquare(27)}
                </div>
                <div className="board-row">
                    {this.renderSquare(28)}
                    {this.renderSquare(29)}
                    {this.renderSquare(30)}
                    {this.renderSquare(31)}
                    {this.renderSquare(32)}
                    {this.renderSquare(33)}
                    {this.renderSquare(34)}
                </div>
                <div className="board-row">
                    {this.renderSquare(35)}
                    {this.renderSquare(36)}
                    {this.renderSquare(37)}
                    {this.renderSquare(38)}
                    {this.renderSquare(39)}
                    {this.renderSquare(40)}
                    {this.renderSquare(41)}
                </div>
                <div className="float-right">{this.props.timeLeft}</div>
            </div>
        );
    }
}

class Info extends React.Component {
    constructor(props) {
        super(props);
        this.handleBidChange = this.handleBidChange.bind(this);
    }

    handleBidChange(e) {
        this.props.updateBid(e.target.value);
    }

    render () {
        const row = parseInt(this.props.selectId / BOARD_COLUMNS + 1, 10);
        const column = parseInt(this.props.selectId % BOARD_COLUMNS + 1, 10);
        const bidPrice = this.props.bidPrice;
        const teams = this.props.teams;
        const scores = this.props.scores;
        const selectTeam = this.props.selectTeam;
        const currentSquarePrice = this.props.currentSquarePrice;
        let teamScores = [];
        let currentSquareInfo;
        for (let i = 0; i < teams.length; ++i) {
            let score = 0;
            if (scores && scores.length > i) {
                score = scores[i];
            }
            teamScores.push(
            <TeamScore 
                key={teams[i]} 
                team={teams[i]} 
                score={score} 
                selectTeam={selectTeam}
                onClick={() => this.props.onSelectTeam(teams[i])}
            />)
        }
        if (currentSquarePrice) {
            currentSquareInfo = "(Current Bid: " + currentSquarePrice + ")";
        }
        return (
            <div className="dark">
                <div className="bid-table">
                    <div>
                        <img className="vertical-icon" src='position.png' alt="Position"/>
                        <span className="position-text"> ({row}, </span>
                        <span className="position-text">{column})</span>
                    </div>
                    <div>
                        <input className="bid-input" type="number" placeholder="input price..." value={bidPrice} onChange={this.handleBidChange}>
                        </input>
                        <button className="bid-button" onClick={this.props.onClick}>Bid</button>
                        <span className="current-bid-text">{currentSquareInfo}</span>
                    </div>
                    <div>
                        {teamScores}
                    </div>
                </div>
            </div>
        );
    }
}

class Bid extends React.Component {
    constructor(props) {
        super(props);
        this.handleBidChange = this.handleBidChange.bind(this);
        this.bidCountdown = this.bidCountdown.bind(this);
        this.updateScores = this.updateScores.bind(this);
        this.state = {
            web3: null,
            teams: ["team-A", "team-B", "team-C", "team-D"],
            scores: [],
            board: { squares: Array(42).fill(null) },
            team: '',
            selectedSquare: -1,
            bidPrice: '',
            timeLeft: 'Action Closed',
            countdownInterval: null,
            landPotAuctionInstance: null,
            accounts: null,
            poolBalance: "",
        }
    }
    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.
        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3
                })
                // Instantiate contract once web3 provided.
                this.instantiateContract()
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    componentDidMount() {
        this.bidCountdown();
        var interval = setInterval(this.bidCountdown, 1000);
        this.setState({countdownInterval: interval});
    }

    componentWillUnmount() {
        clearInterval(this.state.countdownInterval);
    }

    instantiateContract() {
        const contract = require('truffle-contract')
        const landPotAuction = contract(LandPotAuctionContract)
        landPotAuction.setProvider(this.state.web3.currentProvider)

        // Declaring this for later so we can chain functions on landPotAuction.

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            landPotAuction.deployed().then((instance) => {
                this.setState({
                    landPotAuctionInstance: instance,
                    accounts: accounts,
                })
                console.log("land pot auction instance is set.");
                // Gets auction ending time.
                return instance.getEndingTime.call()
            }).then((result) => {
                // Set auction ending time.
                const endingDate = new Date(0)
                endingDate.setUTCSeconds(result.toNumber())
                END_DATE = endingDate;
                // Gets all plots.
                return this.state.landPotAuctionInstance.getPlots.call()
            }).then((result) => {
                const newSquares = this.state.board.squares.slice();
                for (let i = 0; i < 42; ++i) {
                    if (result[4][i].toNumber() > 0) {
                        console.log("square[" + i + "]: bid-" + result[4][i]);
                        newSquares[i] = { team: this.state.teams[result[3][i].toNumber()], bid: this.state.web3.utils.fromWei(result[4][i].toString()) }
                    }
                }
                this.setState({
                    board: {squares: newSquares},
                });
                return this.state.landPotAuctionInstance.balanceOfMe.call()
            }).then((balance) => {
                // get pool balance
                const b = balance.toNumber();
                this.setState({
                    poolBalance: b,
                })
                console.log('current pool balance: ' + b);
            }).then(() => {this.updateScores()})
        })
    }


    getTransactionUrl (address) {
        return this.getEtherScanUrl('tx', address)
      }
      
      getTokenUrl (address) {
        return this.getEtherScanUrl('token', address)
      }
      
      getContractUrl (address) {
        return this.getEtherScanUrl('address', address)
      }
      
      getEtherScanUrl (type, address) {
        var url = this.state.web3.version.network === 3 ? 'ropsten.etherscan.io' : 'etherscan.io'
        return "<a href='https://" + url + '/' + type + '/' + address + "' target='_blank'>" + address + '</a>'
      }

    bidCountdown() {
        const t = END_DATE.getTime() - new Date().getTime();
        let info;
        if (t < 0) {
            info = "Action Closed";
        } else {
            info = "Ends in: " + Math.floor(t / (1000 * 60 * 60 * 24)) + "d " + Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + "h " + Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)) + "m " + Math.floor((t % (1000 * 60)) / 1000) + "s";
        }
        this.setState({
            timeLeft: info,
        })
    }

    onSquareClick(i) {
        const newSelect = i;
        this.setState({
            selectedSquare: newSelect,
        })
    }

    selectTeam(team) {
        const selectTeam = team;
        this.setState({
            team: selectTeam,
        })
    }

    handleBidChange(bid) {
        const newBid = bid;
        this.setState({
            bidPrice: newBid,
        })
    }

    getSquareIndex(squareId) {
        if (isNaN(squareId) || squareId < 0 || squareId > 41) {
            return null;
        }
        let row = parseInt(squareId / BOARD_COLUMNS, 10) - 3;
        let column = parseInt(squareId % BOARD_COLUMNS, 10) - 3;
        return {row: row, column: column};
    }

    bidSquareLand(squareId, bidTeam, bidPrice) {
        const squareChainIndex = this.getSquareIndex(squareId);
        const teamId = this.state.teams.indexOf(bidTeam);
        if (!squareChainIndex) {
            console.log("bid faild, invalid square Id: {" + squareId + "}");
        }
        if (isNaN(teamId)) {
            console.log("Bid failed, invalid bidTeam: {" + bidTeam + "}");
        }
        this.state.landPotAuctionInstance.bid(squareChainIndex.row, squareChainIndex.column, teamId, { from: this.state.accounts[0], value: this.state.web3.utils.toWei((bidPrice.toString()), 'ether'), gasPrice: 20e9, gas: 150000 })
        .then((txhash) => {
          console.log('bid sent')
          console.log('Successfully placed bid, please wait for the transaction complete. <br />Transaction Hash: ' + this.getTransactionUrl(txhash.tx))
          const newSquares = this.state.board.squares.slice();
          newSquares[squareId] = {team: bidTeam, bid: bidPrice};
          this.setState({
              board: {squares: newSquares},
          });
        }).then(() => {
            this.updateScores();
            console.log("balanceOfMe: " + this.state.landPotAuctionInstance.balanceOfMe().toString());
        }).catch((error) => {
          console.error(error)
        })
    }

    updateScores() {
        let bidBlocks;
        let teams = this.state.teams;
        let teamsScore = [];
        bidBlocks = CalculateBlocks(this.state.board.squares);
        if (bidBlocks) {
            for (let i = 0; i < teams.length; ++i) {
                let score = 0;
                for (let p = 0; p < bidBlocks.length; ++p) {
                    if (bidBlocks[p].team === teams[i]) {
                        for (let b = 0; b < bidBlocks[p].blocks.length; ++b) {
                            let blockScore = 0;
                            let scoreMultiplier = 1;
                            let bonusScore = 0;
                            const currentBlock = bidBlocks[p].blocks[b];
                            let blockCounter = currentBlock.length;
                            blockScore += 5 * blockCounter * (blockCounter + 1);
                            for (let s = 0; s < currentBlock.length; ++s) {
                                if (DOUBLE_POS.includes(currentBlock[s])) {
                                    scoreMultiplier *= 2;
                                } else if (TRIPPLE_POS.includes(currentBlock[s])) {
                                    scoreMultiplier *= 3;
                                } else if (POINTS_POS.includes(currentBlock[s])) {
                                    bonusScore += 10;
                                }
                            }
                            score += blockScore * scoreMultiplier + bonusScore;
                        }
                    }
                }
                teamsScore.push(score);
            }
        }
        this.setState({
            scores: teamsScore,
        });
    }

    popupHint(hint) {
        alert(hint);
    }

    onBidClick() {
        const squareId = this.state.selectedSquare;
        const teamID = this.state.team;
        const bidPrice = parseFloat(this.state.bidPrice);
        if (squareId < 0 || squareId >= this.state.board.squares.length) {
            this.popupHint("please select a land first.");
            return;
        }
        if (teamID === '') {
            this.popupHint("please select a team first.");
            return;
        }
        const bidSquare = this.state.board.squares[squareId];
        if (isNaN(bidPrice) || bidPrice <= 0) {
            this.popupHint("Please input a valid bid price.");
            return;
        } else {
            if (!bidSquare) {
                this.bidSquareLand(squareId, teamID, bidPrice);
            } else if (bidSquare.team === teamID) {
                this.bidSquareLand(squareId, teamID, parseFloat(bidSquare.bid) + bidPrice);
            } else {
                if (bidPrice > parseFloat(bidSquare.bid)) {
                    this.bidSquareLand(squareId, teamID, bidPrice);
                } else {
                    this.popupHint("Please make a bid higher than current bid.(current: " + bidSquare.bid + " your bid: " + bidPrice + ")");
                }
            }
        }
    }

    render() {
        const selectedSquareId = this.state.selectedSquare;
        const selectTeam = this.state.team;
        const bidPrice = this.state.bidPrice;
        const teams = this.state.teams;
        const scores = this.state.scores;
        const squares = this.state.board.squares;
        const currentSquare = squares[selectedSquareId];
        let currentSquarePrice;
        if (currentSquare) {
            currentSquarePrice = currentSquare.bid;
        }
        let currentBalance = this.state.poolBalance;
        if (!currentBalance) {
            currentBalance = 0;
        }
        return (
            <div className="body">
                <Navbar
                    pool={currentBalance} 
                />
                <Board
                    selectId={selectedSquareId}
                    squares={squares}
                    onClick={(i) => this.onSquareClick(i)}
                    timeLeft={this.state.timeLeft}
                />
                <Info
                    teams={teams}
                    selectId={selectedSquareId}
                    bidPrice={bidPrice}
                    updateBid={this.handleBidChange}
                    onClick={() => this.onBidClick()}
                    selectTeam={selectTeam}
                    onSelectTeam={(teamId) => this.selectTeam(teamId)}
                    currentSquarePrice={currentSquarePrice}
                    scores={scores}
                />
            </div>
        );
    }
}

function CalculateBlocks(squares) {
    let points = [];
    for (let i = 0; i < squares.length; ++i) {
        let currentSquare = squares[i];
        if (currentSquare) {
            // insert block
            let isNewTeam = true;
            for (let t = 0; t < points.length; ++t) {
                let currentScoreRow = points[t];
                if (currentScoreRow.team === currentSquare.team) {
                    isNewTeam = false;
                    let isNewBlock = true;
                    let connectedBlocks = [];
                    connectedBlocks.push(i);
                    let notConnectedBlocks = [];
                    for (let b = 0; b < currentScoreRow.blocks.length; ++b) {
                        let currentBlock = currentScoreRow.blocks[b];
                        if (IsBlock(i, currentBlock)) {
                            isNewBlock = false;
                            connectedBlocks = connectedBlocks.concat(currentBlock);
                        } else {
                            notConnectedBlocks.push(currentBlock);
                        }
                    }

                    if (isNewBlock) {
                        let newBlock = [i];
                        currentScoreRow.blocks.push(newBlock);
                    } else {
                        let newBlocks = [];
                        if (connectedBlocks) {
                            newBlocks.push(connectedBlocks);
                        }
                        if (notConnectedBlocks) {
                            newBlocks = newBlocks.concat(notConnectedBlocks);
                        }
                        currentScoreRow.blocks = newBlocks;
                    }
                    break;
                }
            }
            if (isNewTeam) {
                points.push({
                    team: currentSquare.team,
                    blocks: [[i]],
                });
            }
        }
    }
    return points;
}

function IsBlock(square, block) {
    for (let i = 0; i < block.length; ++i) {
        if (IsConnected(square, block[i])) {
            return true;
        }
    }
    return false;
}

function IsConnected(first, second) {
    let difference = parseInt(second, 10) - parseInt(first, 10);
    difference = Math.abs(difference);
    if (difference === BOARD_COLUMNS || difference === 1) {
        return true;
    }
    return false;
}

export default Bid

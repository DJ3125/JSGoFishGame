//Non-changing Arrays
let OriginalDeck = [];
const Types = ['H','D','S','C'];

//Changing Variables
let PlayingDeck = [];
let PlayersCards = [];
let BotNum = 2;
let Turn = 0;
let Initialize = false;
let SortedItems = [];
let TurnPart = 0;
let PairsCreated = [];
let Quitting = false;
let WinnerFound = false;
let BeforeQuit = [null,null,null];
let Result = null;
let Starting = false;
let Difficulty = null;
let ComputerAI = [];
let MovingCards = [];

//Canvases

let TPAMethods = {
    canvas: document.getElementById('GameArea'),
    background: function(){
        let g = document.getElementById('GameArea');
        let Background = new CreateSprites(0,0,g.width, g.height, 0, 'Background','Area','Stay');
        Background.draw();
    },
    draw: function(){
        let x = document.getElementById('GameArea');
        let ctx = x.getContext('2d');
        let TurnArrow = new CreateSprites(x.width/2-15,x.height/2-15,30,30, 225, 'Arrow', 'Area','Stay');
        let Trash = new CreateSprites(255,0,40,40,0,'Trash', 'Area', 'Stay');
        let Frames = 0;
        setInterval(function(){
            Frames = Frames +1;
            ctx.clearRect(0,0,x.width, x.height);
            TPAMethods.background();
            if(Initialize === true){
                TPAMethods.display();
                Trash.draw();
                for(let i = 0; i<PlayingDeck.length; i++){
                    let DeckCards = new CreateSprites(x.width/2-15-0.25*i,x.height/2-15-0.25*i,30,30, 0, 'Backside', 'Area','Stay');
                    DeckCards.draw();
                }
                let BenchMarks;
                if(BotNum+1===2){
                    BenchMarks = [90,270];
                }else if(BotNum+1===3){
                    BenchMarks = [90, 180, 0];
                }else if(BotNum+1===4){
                    BenchMarks = [90,180,270,0];
                }
                if(Starting===true){
                    TurnArrow.angle = BenchMarks[Turn%(BotNum+1)]+225;
                }
                TurnArrow.draw();
                if((Frames%1===0)&&(!((TurnArrow.angle-225)%360===BenchMarks[Turn%(BotNum+1)]))){
                    TurnArrow.angle = TurnArrow.angle+5;
                }
            }
            for(let i = 0; i<MovingCards.length; i++){
                MovingCards[i].Change();
                MovingCards[i].draw();
            }
        },1);
    },
    display: function() {
        let x = document.getElementById('GameArea');
        let ctx = x.getContext('2d');
        for(let i = 0; i<PlayersCards[0].length; i++) {
            let Cards = new CreateSprites((x.width - (5 * (PlayersCards[0].length - 1) + 30)) / 2 + 5 * i, x.height-10-30, 30, 30, 0, 'Backside', 'Area','Stay');
            Cards.draw();
        }
        for(let i = 0; i<PlayersCards[1].length; i++){
            if(BotNum+1===2){
                let Cards = new CreateSprites((x.width - (5 * (PlayersCards[1].length - 1) + 30)) / 2 + 5 * i, 10, 30, 30, 0, 'Backside', 'Area','Stay');
                Cards.draw();
            }else{
                let Cards = new CreateSprites(20, (x.height - (3 * (PlayersCards[1].length - 1) + 15))/2 + 3 * i-20, 15, 45, 90, 'Backside', 'Area','Stay');
                Cards.draw();
            }
        }
        if(BotNum+1>=3){
            for(let i = 0; i<PlayersCards[2].length; i++){
                if(BotNum+1===3){
                    let Cards = new CreateSprites(260, (x.height - (3 * (PlayersCards[1].length - 1) + 15))/2 + 3 * i-20, 15, 45, 90, 'Backside', 'Area','Stay');
                    Cards.draw();
                } else{
                    let Cards = new CreateSprites((x.width - (5 * (PlayersCards[1].length - 1) + 30)) / 2 + 5 * i, 10, 30, 30, 0, 'Backside', 'Area','Stay');
                    Cards.draw();
                }
            }
        }
        if(BotNum+1===4){
            for(let i = 0; i<PlayersCards[2].length; i++){
                let Cards = new CreateSprites(260, (x.height - (3 * (PlayersCards[1].length - 1) + 15))/2 + 3 * i-20, 15, 45, 90, 'Backside', 'Area','Stay');
                Cards.draw();
            }
        }
        ctx.font = '10px Arial';
        ctx.fillText('You', x.width/2-10,105);
        if(BotNum===1){
            ctx.font = '10px Arial';
            ctx.fillText('Player 1', x.width/2-20,50);
        }else if(BotNum===2){
            ctx.save();
            ctx.translate(60,50);
            ctx.rotate(90*Math.PI/180);
            ctx.font = '10px Arial';
            ctx.fillText('Player 1', 0,0);
            ctx.restore();
            ctx.save();
            ctx.translate(235,90);
            ctx.rotate(270*Math.PI/180);
            ctx.font = '10px Arial';
            ctx.fillText('Player 2', 0,0);
            ctx.restore();
        } else if(BotNum===3){
            ctx.save();
            ctx.translate(60,50);
            ctx.rotate(90*Math.PI/180);
            ctx.font = '10px Arial';
            ctx.fillText('Player 1', 0,0);
            ctx.restore();
            ctx.font = '10px Arial';
            ctx.fillText('Player 2', x.width/2-20,50);
            ctx.save();
            ctx.translate(238,90);
            ctx.rotate(270*Math.PI/180);
            ctx.font = '10px Arial';
            ctx.fillText('Player 3', 0,0);
            ctx.restore();
        }
    },
}

let TPDMethods = {
    canvas: document.getElementById('PlayerDeck'),
    start: function(){
        let x = document.getElementById('PlayerDeck');
        let ctx = x.getContext('2d');
        setInterval(function(){
            ctx.clearRect(0,0,x.width, x.height);
            TPDMethods.background();
            TPDMethods.display();
        },1);
    },
    show: function(){
        let x = document.getElementById('PlayerDeck');
        let ctx = x.getContext('2d');
        ctx.clearRect(0,0,x.width, x.height);
        TPDMethods.background();
        TPDMethods.display();
    },
    display: function(){
        let PlayerDeckGroup = [];
        if((Initialize ===true)&&(WinnerFound===false)){
            while (PlayerDeckGroup.length>0){
                PlayerDeckGroup.splice(0,1);
            }
            while(PlayersCards[0].indexOf(undefined)>=0){
                PlayersCards[0].splice(PlayersCards[0].indexOf(undefined),1);
            }
            let scale = 0.05;
            for(let i = 0; i<PlayersCards[0].length; i++){
                let NewCard = new CreateSprites(10+i*10, 10, 1200*scale, 2600*scale, 0 , PlayersCards[0][i], 'Deck','Stay');
                NewCard.draw();
                PlayerDeckGroup.push(NewCard);
            }
        } else if(WinnerFound===true){
            let x = document.getElementById('PlayerDeck');
            let ctx = x.getContext('2d');
            ctx.font = '70px Arial White';
            if(Result ===1){
                ctx.fillText('You Won', 10, 100);
            }else if(Result===2){
                ctx.fillText('You Lost', 10, 100);
            }else if(Result===3){
                ctx.fillText('You Tied', 10, 100);
            }
        }
    },
    background: function(){
        let g = document.getElementById('PlayerDeck');
        let Background = new CreateSprites(0,0,g.width, g.height, 0, 'Background','Deck','Stay');
        Background.draw();
    }
}

let DebugVar;
//Create Deck
function InitializeDeck(){
    for(let Prefix = 0; Prefix < 4; Prefix++){
        for(let Suffix = 1; Suffix < 14; Suffix++){
            OriginalDeck.push(String(Types[Prefix]+Suffix));
        }
    }
    for(let i = 0; i<13; i++){
        ComputerAI.push(0);
    }
    document.getElementById('CommentaryTitle').style.visibility = 'hidden';
}

//Sets Up the Game
function ShuffleAndDealDeck(){
    for (let g = 0; g<OriginalDeck.length; g++){
        PlayingDeck.push(OriginalDeck[g]);
    }
    while (PlayersCards.length>0){
        PlayersCards.splice(0,1);
    }
    document.getElementById('Options').style.visibility = 'hidden';
    document.getElementById('OptionsDialogue').style.visibility = 'hidden';
    for(let i = 0; i<1000; i++){
        let random = Math.floor(Math.random()*PlayingDeck.length);
        PlayingDeck.push(PlayingDeck[random]);
        PlayingDeck.splice(random,1);
    }
    for(let PlayerDecks = 0; PlayerDecks<BotNum+1; PlayerDecks++){
        let BasicArray = [];
        for(let j = 0; j<24/(BotNum+1); j++){
            let x = Math.floor(Math.random()*PlayingDeck.length);
            BasicArray.push(PlayingDeck[x]);
            PlayingDeck.splice(x,1);
        }
        PlayersCards.push(BasicArray);
        PairsCreated.push(0);
    }
    for(let a = 0; a<BotNum+1; a++){
        CheckPairs(a);
        Sort(a);
    }
    TPDMethods.show();
    Display();
}
//Checks If The Game Should Continue
function Quit(Input){
    let Winner = false;
    let Winners = [];
    for(let y = 0; y<BotNum+1; y++){
        if((PlayersCards[y].length===0)&&(PlayingDeck.length===0)){
            Winner = true;
            WinnerFound = true;
            Winners.push(y);
        } else if((PlayersCards[y].length===0)) {
            PlayersCards[y].push(PlayingDeck[0]);
            PlayingDeck.splice(0,1);
        }
    }
    if((Input==='Button')||((Input==='Code')&&(Winner))){
        //Quit the Game
        Initialize = false;
        PlayingDeck = [];
        while(PlayersCards.length>0){
            PlayersCards.splice(0,1);
        }
        while(PairsCreated.length>0){
            PairsCreated.splice(0,1);
        }
        while (SortedItems.length>0){
            SortedItems.splice(0, 1);
        }
        for(let i = 0; i<ComputerAI.length; i++){
            ComputerAI.splice(i,1,0);
        }
        BotNum = 2;
        Turn = 0;
        Initialize = false;
        TurnPart = 0;
        Quitting = false;
        Difficulty = null;
        document.getElementById('QuitButton').style.visibility = 'hidden';
        document.getElementById('OptionsDialogue').style.visibility = 'hidden';
        document.getElementById('Directions').style.visibility = 'hidden';
        document.getElementById('QuitOptions').style.visibility = 'hidden';
        document.getElementById('DisplayPairs').style.visibility = 'hidden';
        document.getElementById('ActionButton').innerHTML = 'Continue';
        if(Input==='Button'){
            document.getElementById('Settings').style.visibility = 'visible';
            document.getElementById('ActionButton').innerHTML = 'Start';
            document.getElementById('DisplayTurn').innerHTML = 'Please Select Your Settings';
            document.getElementById('Commentary').style.visibility = 'hidden';
            document.getElementById('CommentaryTitle').style.visibility = 'hidden';
        } else {
            document.getElementById('ActionButton').innerHTML = 'Return To Main Menu';
            if(Winners.length===1){
                if(Winners[0]===0){
                    document.getElementById('DisplayTurn').innerHTML = 'You Win';
                    Result = 1;
                } else {
                    document.getElementById('DisplayTurn').innerHTML = 'Computer ' + Winners[0] + ' Wins';
                    Result = 2;
                }
            } else {
                document.getElementById('DisplayTurn').innerHTML = 'Its A Tie!';
                Result = 3;
            }
        }
    }
}

//Practically Does Everything
function Actions() {
    if(WinnerFound===false) {
        if (Initialize === true) {
            Starting = false;
            if (!Quitting) {
                if (Turn % (BotNum + 1) === 0) {
                    //PlayerTurn
                    document.getElementById('ActionButton').innerHTML = 'Submit'
                    document.getElementById('DisplayTurn').innerHTML = 'Your Turn';
                    document.getElementById('Directions').style.visibility = 'visible';
                    document.getElementById('Directions').innerHTML = 'Please Ask For A Card';
                    let Visible = document.getElementById('Options').style.visibility;
                    if (Visible === 'hidden') {
                        CreateOptions(0);
                        let SelectionArea = document.getElementById('Options');
                        for (let y = 0; y < SortedItems.length; y++) {
                            let NewOption = document.createElement('option');
                            if (SortedItems[y] === 1) {
                                NewOption.text = 'Ace';
                            } else if (SortedItems[y] === 11) {
                                NewOption.text = 'Jack';
                            } else if (SortedItems[y] === 12) {
                                NewOption.text = 'Queen';
                            } else if (SortedItems[y] === 13) {
                                NewOption.text = 'King';
                            } else {
                                NewOption.text = SortedItems[y];
                            }
                            SelectionArea.options.add(NewOption);
                        }
                        document.getElementById('Options').style.visibility = 'visible';
                        document.getElementById('OptionsDialogue').style.visibility = 'visible';
                    } else {
                        PickCards(0, SortedItems);
                        document.getElementById('Options').style.visibility = 'hidden';
                        document.getElementById('OptionsDialogue').style.visibility = 'hidden';
                        while(document.getElementById('Options').length>0){
                            document.getElementById('Options').remove(0);
                        }
                        TurnPart = 0;
                        Turn = Turn + 1;
                        document.getElementById('DisplayTurn').innerHTML = 'Your Turn Is Over';
                        document.getElementById('ActionButton').innerHTML = 'Continue';
                        document.getElementById('Directions').style.visibility = 'hidden';
                    }
                } else {
                    //ComputerTurn
                    document.getElementById('ActionButton').innerHTML = 'Continue';
                    if (TurnPart === 0) {
                        document.getElementById('DisplayTurn').innerHTML = 'Computer ' + Turn % (BotNum + 1) + ' Turn';
                        TurnPart = 1;
                    } else if (TurnPart === 1) {
                        document.getElementById('DisplayTurn').innerHTML = 'Computer ' + Turn % (BotNum + 1) + ' Turn Is Over';
                        CreateOptions(Turn % (BotNum + 1));
                        PickCards(Turn % (BotNum + 1), SortedItems);
                        TurnPart = 0;
                        Turn = Turn + 1;
                    }
                }
                for (let a = 0; a < BotNum + 1; a++) {
                    if (PlayersCards[a].length > 0) {
                        CheckPairs(a);
                    }
                    Sort(a);
                }
                TPDMethods.show();
                Display();
                Quit('Code');
            } else {
                if (document.getElementById('QuitOptions').value === 'Yes') {
                    Quit('Button');
                    AddComment('You Quit. Quitter.');
                } else {
                    document.getElementById('QuitButton').style.visibility = 'visible';
                    document.getElementById('QuitOptions').style.visibility = 'hidden';
                    document.getElementById('ActionButton').innerHTML = 'Continue';
                    document.getElementById('Directions').style.visibility = BeforeQuit[2];
                    Quitting = false;
                    document.getElementById('Directions').innerHTML = BeforeQuit[1];
                    document.getElementById('Options').style.visibility = BeforeQuit[0];
                    document.getElementById('OptionsDialogue').style.visibility = BeforeQuit[0];
                }
            }
        } else {
            Initialize = true;
            BotNum = Number(document.getElementById('AmountOfBots').value);
            Difficulty = document.getElementById('Difficulty').value;
            ShuffleAndDealDeck();
            Turn = Math.floor(Math.random() * (BotNum + 1));
            Starting = true;
            document.getElementById('DisplayPairs').style.visibility = 'visible';
            document.getElementById('OptionsDialogue').style.visibility = 'hidden';
            document.getElementById('Options').style.visibility = 'hidden';
            document.getElementById('QuitOptions').style.visibility = 'hidden';
            document.getElementById('QuitButton').style.visibility = 'visible';
            document.getElementById('Settings').style.visibility = 'hidden';
            document.getElementById('ActionButton').innerHTML = 'Lets Start The Game!';
            document.getElementById('DisplayTurn').innerHTML = 'Please Start The Game';
            document.getElementById('Commentary').style.visibility = 'visible';
            document.getElementById('CommentaryTitle').style.visibility = 'visible';
            Result = null;
        }
    } else {
        document.getElementById('DisplayPairs').style.visibility = 'hidden';
        document.getElementById('OptionsDialogue').style.visibility = 'hidden';
        document.getElementById('Options').style.visibility = 'hidden';
        document.getElementById('QuitOptions').style.visibility = 'hidden';
        document.getElementById('QuitButton').style.visibility = 'hidden';
        document.getElementById('Settings').style.visibility = 'visible';
        document.getElementById('DisplayTurn').innerHTML = 'Please Select Your Settings';
        document.getElementById('ActionButton').innerHTML = 'Start';
        document.getElementById('Commentary').style.visibility='hidden';
        document.getElementById('CommentaryTitle').style.visibility = 'hidden';
        WinnerFound = false;
        while(MovingCards.length>0){
            MovingCards.splice(0,1);
        }
    }
}

function Display(){
    if (false) {
        // console.log(PlayersCards[0])
        // console.log(PlayersCards[1])
        // console.log(PlayersCards[2])
        // console.log(PlayersCards[3])
        // console.log(PlayingDeck)
        document.getElementById('PlayerCards').innerHTML = PlayersCards[0];
        document.getElementById('C1Cards').innerHTML = PlayersCards[1];
        document.getElementById('C2Cards').innerHTML = PlayersCards[2];
        document.getElementById('C3Cards').innerHTML = PlayersCards[3];
        document.getElementById('Deck').innerHTML = PlayingDeck;
        document.getElementById('PlayerPairs').innerHTML = 'You have Made ' + PairsCreated[0] + ' pairs';
        document.getElementById('C1Pairs').innerHTML = 'Computer 1 has made ' + PairsCreated[1] + ' pairs';
        document.getElementById('C2Pairs').innerHTML = 'Computer 2 has made ' + PairsCreated[2] + ' pairs';
    }
}

function CreateOptions(PlayerGo){
    let PlayerOptions = [];
    while(PlayersCards[PlayerGo].indexOf(undefined)>=0){
        PlayersCards[PlayerGo].splice(PlayersCards[PlayerGo].indexOf(undefined),1);
    }
    for(let i = 0; i < PlayersCards[PlayerGo].length; i++){
        if(PlayerOptions.indexOf(PlayersCards[PlayerGo][i].substring(1,PlayersCards[PlayerGo][i].length))===-1){
            PlayerOptions.push(PlayersCards[PlayerGo][i].substring(1,PlayersCards[PlayerGo][i].length));
        }
    }
    let PlayerOptionsSorted = [];
    for (let n = 1; n < 14; n++) {
        for (let l = 0; l < PlayerOptions.length; l++) {
            if (PlayerOptions[l] === String(n)) {
                PlayerOptionsSorted.push(n);
            }
        }
    }
    while(SortedItems.length > 0){
        SortedItems.splice(0,1);
    }
    for(let aa=0; aa<PlayerOptionsSorted.length; aa++){
        SortedItems.push(PlayerOptionsSorted[aa])
    }
}

function PickCards(PlayerGo, CardOptions){
    let found = false;
    let Player = null;
    let Selected;
    if(PlayerGo === 0){
        if(String(document.getElementById('Options').value)==='Ace'){
            Selected = '1';
        } else if(String(document.getElementById('Options').value)==='Jack'){
            Selected = '11';
        } else if(String(document.getElementById('Options').value)==='Queen'){
            Selected = '12';
        } else if(String(document.getElementById('Options').value)==='King'){
            Selected = '13';
        } else {
            Selected = document.getElementById('Options').value;
        }
    } else{
        if((Difficulty==='Easy')||(CardOptions.length===1)){
            Selected = String(CardOptions[Math.floor(Math.random()*CardOptions.length)]);
        }else{
            let options = CountCards(PlayerGo);
            let picking = [];
            for(let i = 0; i<13; i++){
                if(!(ComputerAI[i]===null)){
                    if(Number(ComputerAI[i])+Number(options[i])===4){
                        picking.push(i+1);
                    }
                }
            }
            if(picking.length===0){
                Selected = String(CardOptions[Math.floor(Math.random()*CardOptions.length)]);
            } else {
                let x = Math.random()*picking.length;
                Selected = String(picking[Math.floor(x)]);
            }
        }
    }
    let TransferCards = [];
    for(let t = PlayerGo+1; t<PlayersCards.length+PlayerGo; t++){
        let Selection = t%(BotNum+1);
        for(let l = 0; l<PlayersCards[Selection].length; l++){
            if(((PlayersCards[Selection])[l]).substring(1,PlayersCards[Selection][l].length)===Selected){
                found = true;
                Player = Selection;
                break;
            }
        }
        if(found===true){
            break;
        }
    }
    if(found===true){
        if(PlayerGo===0){
            AddComment('You Asked For a ' +document.getElementById('Options').value+' and  got it from Computer '+Player);
        }else{
            if(Player===0){
                if(Selected==='1'){
                    AddComment('Computer '+PlayerGo+' Asked For an Ace And Got It From You!');
                }else if(Selected==='11'){
                    AddComment('Computer '+PlayerGo+' Asked For a Jack And Got It From You!');
                } else if(Selected==='12'){
                    AddComment('Computer '+PlayerGo+' Asked For a Queen And Got It From You!');
                }else if(Selected==='13'){
                    AddComment('Computer '+PlayerGo+' Asked For a King And Got It From You!');
                }else{
                    AddComment('Computer '+PlayerGo+' Asked For '+Selected+ ' And Got It From You!');
                }
            } else{
                if(Selected==='1'){
                    AddComment('Computer '+PlayerGo+' Asked For an Ace And Got it From Computer '+Player);
                }else if(Selected==='11'){
                    AddComment('Computer '+PlayerGo+' Asked For a Jack And Got it From Computer '+Player);
                } else if(Selected==='12'){
                    AddComment('Computer '+PlayerGo+' Asked For a Queen And Got it From Computer '+Player);
                }else if(Selected==='13'){
                    AddComment('Computer '+PlayerGo+' Asked For a King And Got it From Computer '+Player);
                }else{
                    AddComment('Computer '+PlayerGo+' Asked For '+Selected+' And Got it From Computer '+Player);
                }
            }
        }
        for(let y = 0; y<PlayersCards[Player].length; y++){
            if(PlayersCards[Player][y].substring(1, PlayersCards[Player][y].length)===Selected){
                TransferCards.push(PlayersCards[Player][y]);
            }
        }
        ComputerAI.splice(Number(TransferCards[0].substring(1,TransferCards[0].length))-1,1,TransferCards.length);
        for(let c = 0; c<TransferCards.length; c++){
            PlayersCards[PlayerGo].push(TransferCards[c]);
            PlayersCards[Player].splice(PlayersCards[Player].indexOf(TransferCards[c]),1);
        }
    }else{
        PlayersCards[PlayerGo].push(PlayingDeck[0]);
        PlayingDeck.splice(0,1);
        if(PlayerGo ===0){
            AddComment('You Asked For a ' +document.getElementById('Options').value+' but you gone and fished');
        }else{
            if(Selected==='1'){
                AddComment('Computer '+PlayerGo+' Asked For an Ace But Gone and Fished');
            }else if(Selected==='11'){
                AddComment('Computer '+PlayerGo+' Asked For a Jack But Gone and Fished');
            }else if(Selected==='12'){
                AddComment('Computer '+PlayerGo+' Asked For a Queen But Gone and Fished');
            }else if(Selected==='13'){
                AddComment('Computer '+PlayerGo+' Asked For a King But Gone and Fished');
            }else{
                AddComment('Computer '+PlayerGo+' Asked For '+ Selected +' But Gone and Fished');
            }
        }
    }
}

function CheckPairs(PlayerGo){
    let CardType = CountCards(PlayerGo);
    let SetsCompleted = [];
    for(let f =0; f<13; f++){
        if(CardType[f]===4){
            SetsCompleted.push(f+1);
        }
    }
    PairsCreated.splice(PlayerGo,1,PairsCreated[PlayerGo]+SetsCompleted.length);
    let Delete = [];
    while(PlayersCards[PlayerGo].indexOf(undefined)>=0){
        PlayersCards[PlayerGo].splice(PlayersCards[PlayerGo].indexOf(undefined),1);
    }
    for(let b = 0; b<SetsCompleted.length; b++){
        for(let u =0; u<PlayersCards[PlayerGo].length; u++){
            if(PlayersCards[PlayerGo][u].substring(1,PlayersCards[PlayerGo][u].length)===String(SetsCompleted[b])){
                Delete.push(PlayersCards[PlayerGo][u]);
            }
        }
    }
    if(Delete.length>0){
        if(PlayerGo===0){
            AddComment('You Made A Set of 4 out of '+Delete[0].substring(1 , Delete[0].length));
            AddComment('You Now Have A Total Of '+ PairsCreated[0]+' Pairs Created');
        }else{
            AddComment('Computer '+ PlayerGo+' made a set of 4 out of '+Delete[0].substring(1 , Delete[0].length));
            AddComment('Computer '+ PlayerGo+' Now Has a Total of '+PairsCreated[PlayerGo]+' Pairs Created');
        }
        let x = document.getElementById('GameArea');
        if(PlayerGo===0){
            for(let i=0; i<4; i++){
                let MovingCard = new CreateSprites(x.width/2 + 5 * i, x.height-10-30, 30, 30, 0, 'Backside', 'Area','Move');
                MovingCards.push(MovingCard);
            }
        }else if(PlayerGo===1){
            let MovingCard;
            for(let i = 0; i<4; i++){
                if(BotNum===1){
                    MovingCard = new CreateSprites(x.width/ 2 + 10 * i, 10, 30, 30, 0, 'Backside', 'Area','Move');
                }else{
                    MovingCard = new CreateSprites(20, x.height/2 + 6 * i-20, 30, 30, 90, 'Backside', 'Area','Move');
                }
                MovingCards.push(MovingCard);
            }
        }else if(PlayerGo===2){
            for(let i = 0; i<4; i++){
                let MovingCard;
                if(BotNum===2){
                    MovingCard = new CreateSprites(260, x.height/2 + 6 * i-20, 30, 30, 90, 'Backside', 'Area','Move');
                } else{
                    MovingCard = new CreateSprites(x.width/ 2 + 10 * i, 10, 30, 30, 0, 'Backside', 'Area','Move');
                }
                MovingCards.push(MovingCard);
            }
        }else if(PlayerGo===3){
            for(let i = 0; i<4; i++){
                let MovingCard = new CreateSprites(260, x.height/2 + 6 * i-20, 30, 30, 90, 'Backside', 'Area','Move');
                MovingCards.push(MovingCard);
            }
        }
    }
    for(let g = 0; g<Delete.length; g++){
        PlayersCards[PlayerGo].splice(PlayersCards[PlayerGo].indexOf(Delete[g]),1);
        if(!(ComputerAI[(Number(Delete[g].substring(1,Delete[g].length))-1)]===null)){
            ComputerAI.splice((Number(Delete[g].substring(1,Delete[g].length))-1),1,null);
        }
    }
}

function Sort(PlayerGo){
    let SortedByNumber = [];
    let FinalArray = [];
    for(let g = 0; g<13; g++){
        let y = [];
        SortedByNumber.push(y);
    }
    let UnsortedCards = PlayersCards[PlayerGo];
    for(let i = 0; i<UnsortedCards.length; i++){
        SortedByNumber[Number(UnsortedCards[i].substring(1, UnsortedCards[i].length))-1].push(UnsortedCards[i]);
    }
    for(let d = 0; d<13; d++){
        let SortThis = SortedByNumber[d];
        let NewArray = [];
        for(let p = 0; p<4; p++){
            for(let q = 0; q<SortThis.length; q++){
                if(SortThis[q].charAt(0)===Types[p]){
                    NewArray.push(SortThis[q]);
                }
            }
        }
        SortedByNumber.splice(d,1,NewArray);
    }
    for(let s = 0; s<13; s++){
        for(let x = 0; x<SortedByNumber[s].length; x++){
            FinalArray.push(SortedByNumber[s][x]);
        }
    }
    PlayersCards.splice(PlayerGo,1,FinalArray);
}

function AskQuit(){
    let x = document.getElementById('Options').style.visibility;
    BeforeQuit.splice(0,1,x);
    x = document.getElementById('Directions').innerHTML;
    BeforeQuit.splice(1,1,x);
    x = document.getElementById('Directions').style.visibility;
    BeforeQuit.splice(2,1,x);
    document.getElementById('Directions').style.visibility = 'visible';
    document.getElementById('Directions').innerHTML = 'Are You Sure You Want To Quit?'
    document.getElementById('QuitButton').style.visibility = 'hidden';
    document.getElementById('Options').style.visibility = 'hidden';
    document.getElementById('OptionsDialogue').style.visibility = 'hidden';
    document.getElementById('QuitOptions').style.visibility = 'visible';
    document.getElementById('ActionButton').innerHTML = 'Submit';
    Quitting = true;
}

function OnLoad(){
    InitializeDeck();
    TPDMethods.start();
    TPAMethods.draw();
    window.devicePixelRatio=2;
}

function CreateSprites(x,y,width,height,angle,img,input,status){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
    this.image= new Image();
    this.image.src = 'Pictures/'+img+'.jpg';
    this.input = input;
    this.status = status;
    this.DrawAngle = function(){
        let y ;
        if(this.input ==='Deck'){
            y = document.getElementById('PlayerDeck');
        } else {
            y = document.getElementById('GameArea');
        }
        let ctx = y.getContext('2d');
        ctx.save();
        ctx.translate(this.x+this.width/2,this.y+this.height/2);
        ctx.rotate(this.angle*Math.PI/180);
        //ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image, this.width/-2, this.height/-2, this.width, this.height);
        ctx.restore();
    }
    this.Change = function(){
        if(this.status==='Move'){
            let canvas = document.getElementById('GameArea');
            if((Math.sqrt((canvas.width-this.x)**2+(10-this.y)**2)>20)){
                this.x = this.x + (canvas.width-this.x)*0.01;
                this.y = this.y + (10-this.y)*(0.01);
                this.angle = this.angle +5;
            }else if(this.width>5){
                this.width = this.width*0.85;
                this.height = this.height*0.85;
            } else {
                this.delete();
            }
        }
    }
    this.draw = function(){
        this.DrawAngle();
    }
    this.delete = function(){
        delete (this.x);
        delete (this.y);
        delete (this.angle);
        delete (this.width);
        delete (this.height);
        delete (this.input);
        delete (this.status);
    }
}

function CountCards(PlayerGoes){
    let CardType = [];
    for(let i = 0; i<13; i++){
        CardType.push(0);
    }
    while(PlayersCards[PlayerGoes].indexOf(undefined)>=0){
        PlayersCards[PlayerGoes].splice(PlayersCards[PlayerGoes].indexOf(undefined),1);
    }
    for(let y = 1; y<14; y++){
        for(let z = 0; z < PlayersCards[PlayerGoes].length; z++){
            if(PlayersCards[PlayerGoes][z].substring(1, PlayersCards[PlayerGoes][z].length)===String(y)){
                CardType.splice(y-1, 1, CardType[y-1]+1);
            }
        }
    }
    return(CardType);
}

function AddComment(Dialogue){
    let NewComment = document.createElement('li');
    let CommentaryBox = document.getElementById('Commentary');
    if(CommentaryBox.childNodes.length>4){
        CommentaryBox.removeChild(CommentaryBox.children[0]);
    }
    let text = document.createTextNode(Dialogue);
    NewComment.appendChild(text);
    CommentaryBox.appendChild(NewComment);
}
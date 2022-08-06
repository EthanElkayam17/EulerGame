var prompt_name = prompt("Enter your name:")
while(prompt_name === null){
    prompt_name = prompt("Enter your name:")
}

//declare const e and other game vars
const e = "2718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427427466391932003059921817413596629043572900334295260595630738132328627943490763233829880753195251019011573834187930702154089149934884167509244761460668082264800168477411853742345442437107539077744992069551702761838606261331384583000752044933826560297606737113200709328709127443747047230696977209310141692836819025515108657463772111252389784425056953696770785449969967946864454905987931636889230098793127736178215424999229576351482208269895193668033182528869398496465105820939239829488793320362509443117301238197068416140397019837679320683282376464804295311802328782509819455815301756717361332069811250996181881593041690351598888519345807273866738589422879228499892086805825749279610484198444363463244968487560233624827041978623209002160990235304369941849146314093431738143640546253152096183690888707016768396424378140592714563549061303107208510383750510115747704171898610687396965521267154688957035035402123407849819334321068170121005627880235193033224745015853904730419957777093503660416997329725088687696640355570716226844716256079882651787134195124665201030592123667719432527867539855894489697096409754591856956380236370162112047742722836489613422516445078182442352948636372141740238893441247963574370263755294448337998016125492278509257782562092622648326277933386566481627725164019105900491644998289315056604725802778631864155195653244258698294695930801915298721172556347546396447910145904090586298496791287406870504895858671747985466775757320568128845920541334053922000113786300945560688166740016984205580403363795376452030402432256613527836951177883863874439662532249850654995886234281899707733276171783928034946501434558897071942586398772754710962953741521115136835062752602326484728703920764310059584116612054529703023647254929666938115137322753645098889031360205724817"
var username = prompt_name
var zUUid = false
SetUpMember();
var current_e = e //holds current game
var length_e = e.length
var firstletter = true
var lettercount = 0 //holds current game progress
var highscore = 0

//get important elements and add event-listeners to buttons
input = document.getElementById("number")
document.getElementById("high-score").innerText = highscore
document.getElementById("one").addEventListener("click", function() {nextMove("1")})
document.getElementById("two").addEventListener("click", function() {nextMove("2")})
document.getElementById("three").addEventListener("click", function() {nextMove("3")})
document.getElementById("four").addEventListener("click", function() {nextMove("4")})
document.getElementById("five").addEventListener("click", function() {nextMove("5")})
document.getElementById("six").addEventListener("click", function() {nextMove("6")})
document.getElementById("seven").addEventListener("click", function() {nextMove("7")})
document.getElementById("eight").addEventListener("click", function() {nextMove("8")})
document.getElementById("nine").addEventListener("click", function() {nextMove("9")})
document.getElementById("zero").addEventListener("click", function() {nextMove("0")}) 

//plays next move with users input
function nextMove(pressed_number){
    if(pressed_number == current_e.charAt(0)){
        if(firstletter){
            document.getElementById("title-score").innerText = "2"
            input.value = "2."
            firstletter = false
        }
        else if(lettercount % 18 == 0){
            input.value = "..."
            input.value += pressed_number
        }
        else{
            input.value += pressed_number
        }
        lettercount += 1
        if(lettercount == 69){
            document.getElementById("title-score").innerText = "Nice"
        }
        else{
            document.getElementById("title-score").innerText = `Score: ${lettercount}`
        }
        current_e = current_e.substring(1)
        if(lettercount == length_e){
            endGame(true)
        }
    }
    else{
        endGame(false, pressed_number)
    }
}

//ends game: win / lose
function endGame(bool, losingnum){
    if(bool){
        console.log("e ran out of digits")
        input.value = `e`
        lettercount = 0
        firstletter = true
        current_e = e
    }
    else{
        if(lettercount > highscore){
            highscore = lettercount
            document.getElementById("high-score").innerText = highscore
            auth = zUUid + "-auth"
            setNewHighScore(highscore,auth)
        }
        missing = current_e.charAt(0)
        input.value = `Next digit was: ${missing}!`
        console.log(`pressed: ${losingnum}, missed: ${missing} - final count: ${lettercount}`)
        lettercount = 0
        firstletter = true
        current_e = e
        console.log("New game Created!")
    }
}

//send highest score to server
function setNewHighScore(score,auth){
    if(auth == zUUid + "-auth"){
        db.collection('users-score').doc(zUUid).update({
            Name: username,
            Score: score
    })
    }
    else{
        console.log('new highscore requires authentication')
    }
}

//get all users from firebase database
function getAllRegisteredUsers(){
    db.collection('users-score').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            console.log(doc.data())
        });
    })
}

//add user to firebase database and send to setup
function addNewUser(name, score){
    db.collection(`users-score`).add({
        Name: name,
        Score: score
    })
    console.log(`${name} added to database!`)
    SetUpMember()
}

//set up current user to play
function SetUpMember(){
    db.collection('users-score').get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
        if(username == doc.data().Name){
            zUUid = doc.id
            highscore = doc.data().Score
            document.getElementById("high-score").innerText = highscore
            console.log(`${username} has joined the game! {Score: ${highscore}}`)
            return;
        }
    });
        if(zUUid == false){
            addNewUser(username, 0)
        }
    })
}
leaderboard = ''
getTopPlayers();

//get top 25 users
function getTopPlayers(){
    db.collection('users-score').orderBy('Score', 'desc').limit(25).get().then(query =>{
        query.forEach(doc => {
            leaderboard += `Name: ${doc.data().Name}, Score: ${doc.data().Score} \n`
        });
        document.getElementById('top-players').innerText = leaderboard
    })
}
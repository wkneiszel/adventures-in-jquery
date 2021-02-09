class storyNode 
{
    title;      //The text which appears on the button
    text;       //The description of the scene
    actions;    //An array of actions you may take (other storyNodes)
    effect;     //A function which executes on display (for visual effects and computation)
    
    constructor(title, text, actions, effect) 
    {
        this.title = title;
        this.text = text;
        this.actions = actions;
        this.effect = effect;
    }

    // Changes the site to display the current storyNode and calls the effect function 
    display() 
    {
        $("#displayText").text(this.text);

        this.makeButtons();

        this.effect();
    }

    makeButtons()
    {
        let buttonArea = $("#buttonArea").empty();

        if(!this.actions.length == 0)
        {
            for(let action of this.actions)
            {
                let button = $("<button>")
                    .text(action.title)
                    .addClass("action")
                    .click(function(){ action.display() });
                buttonArea.append(button);
            }
        }
    }
}

var hp = 3;
var vaccinated = true;
var rabiesProgression = 0;

function rabiesCalculation()
{
    if(vaccinated == false)
    {
        rabiesProgression += 1;
    }
    else
    {
        rabiesProgression = 0;
    }
    if(rabiesProgression >= 5){
        rabiesDeath.display();
    }
}

function setImage(source, alternateText)
{
    $("#displayImage").empty();

    let image = $("<img>")
        .attr("src", source+"?a="+Math.random())     //This is necessary to reload the GIF to make it start over. 
        .attr("alt", alternateText);

    $("#displayImage").prepend(image);
}

var defaultFunction = function()
{
    $("#displayImage").empty();
    rabiesCalculation();
}

var victoryFunction = function()
    {
        setImage("img/castle.gif", "the castle welcomes you");

        $("body")
            .css("background-color", "yellow")
            .css("color", "black");
        $("#mainDisplay")
            .animate({top: '-=20px'}, 100)
            .animate({top: '+=40px'}, 100)
            .animate({top: '-=40px'}, 100)
            .animate({top: '+=20px'}, 100);

        let victoryText = $("<p>")
        .text("You have won.")
        .css("opacity", 0);
    
        $("#mainDisplay").append(victoryText);
        
        victoryText
            .animate({opacity: 0}, 400)
            .animate({opacity: 1}, 2000);

        $("#displayText").css("color", "black");
    };

var defeatFunction = function()
{
    setImage("img/death.gif", "your grave");

    $("body")
        .css("background-color", "red");
    $("#mainDisplay")
        .animate({left: '-=20px'}, 100)
        .animate({left: '+=40px'}, 100)
        .animate({left: '-=40px'}, 100)
        .animate({left: '+=20px'}, 100);

    let deathText = $("<p>")
        .text("You are dead.")
        .css("opacity", 0);
    
    $("#mainDisplay").append(deathText);
    
    deathText.animate({opacity: 1}, 2000);
};

var vaccineFunction = function()
{
    setImage("img/vaccine.gif", "our hero being vaccinated against rabies");

    hp = 3;
    vaccinated = true;
    rabiesCalculation();
};

var exitFunction = function()
{
    caveExteriorFunction();

    if(vaccinated == false && hp < 3)
    {
        if(caveExit.actions.indexOf(vaccinate) == -1)
        {
            caveExit.actions.push(vaccinate);
            walk.actions.push(vaccinate);
        }
    }
    else
    {
        caveExit.actions = [];
        walk.actions = [];

        walk.actions.push(start, cave);
        caveExit.actions.push(cave, start);
    }
    
    caveExit.makeButtons();
};

var damageFunction = function(){

    vaccinated = false;
    hp -= 1;

    if(hp < 1)
    {
        batDeath.display();
        return;
    }

    setImage("img/bite.gif", "a bat bites you");

    $("#mainDisplay")
        .animate({left: '-=10px'}, 100)
        .animate({left: '+=20px'}, 100)
        .animate({left: '-=20px'}, 100)
        .animate({left: '+=10px'}, 100);
    $("#displayText")
        .animate({color: "red"}, 50)
        .animate({color: "white"}, 50)
        .animate({color: "red"}, 50)
        .animate({color: "white"}, 50)
        .animate({color: "red"}, 50)
        .animate({color: "white"}, 50)
        .animate({color: "red"}, 50)
        .animate({color: "white"}, 50);

    rabiesCalculation();
};

var groundsFunction = function()
{
    setImage("img/castlegrounds.gif", "the castle grounds");

    rabiesCalculation();
};

var caveFunction = function()
{
    setImage("img/batcave.gif", "the inside of the cave");

    rabiesCalculation();
};

var aboutFunction = function()
{
    var ghLink = $("<div>").append($("<a>")
        .attr("href", "https://github.com/wkneiszel/adventures-in-jquery")
        .text("View the source code on GitHub"));
    var piskelLink = $("<div>").append($("<a>")
        .attr("href", "https://www.piskelapp.com/")
        .text("Art made using Piskel"));
    
    $("#buttonArea").prepend(ghLink).prepend(piskelLink);
};

var caveExteriorFunction = function()
{
    setImage("img/caveexterior.gif", "the outside of the cave");

    rabiesCalculation();
}

var rabiesDeath = new storyNode(
    "Die of rabies",
    "You contracted rabies back there during your bat-related encounter, and unfortunately you are now met with the consequences of your actions. You die a horrible death, foaming at the mouth and flailing about in agony. You should have gotten that vaccine when you had the chance.",
    [],
    defeatFunction
)

var vaccinate = new storyNode(
    "Get your rabies vaccine",
    "A wandering pharmacist has just now conveniently strolled down the path towards the cave entrance, with many vaccines in tow. You request a quick poke and happily receive their injection. Your health points are restored.",
    [],
    vaccineFunction
);

var batDeath = new storyNode(
    "Die of bat",
    "Three bats is too many bats, and the injuries you have sustained are too dire to continue.",
    [],
    defeatFunction
);

var castle = new storyNode(
    "Go to the castle", 
    "Congratulations, you have arrived at the castle (and they are throwing a party in your honor)", 
    [], 
    victoryFunction
);

var meadow = new storyNode(
    "Go to the meadow", 
    "The meadow is haunted (and you are killed by a ghost)", 
    [], 
    defeatFunction
);

var caveExit = new storyNode(
    "Exit the cave",
    "You have left the cave, and are now at the cave's entrance once more.",
    [],
    exitFunction
)

var batFight = new storyNode(
    "Fight a bat",
    "You take damage fighting the bat (and you should get a rabies shot)",
    [caveExit],
    damageFunction
)

var cave = new storyNode(
    "Enter the cave",
    "You are in a cave. You hear the sound of bats overhead.",
    [batFight, caveExit],
    caveFunction
)

var walk = new storyNode(
    "Go for a walk",
    "You walk for about 15 minutes and find yourself at the mouth of a cave.",
    [cave],
    exitFunction
)

var start = new storyNode(
    "Go to the castle grounds",
    "You are on the castle grounds. The castle is ahead. It is a beautiful summer's day.",
    [meadow, castle, walk],
    groundsFunction
);

var about = new storyNode(
    "About this game",
    "Adventures in jQuery was created by Wilson Kneiszel for an assignment for CS365: Client-Side Web Programming.",
    [],
    aboutFunction
);

var titleScreen = new storyNode(
    "Title screen",
    "You are an adventurer journeying to your home: the castle. You have been on many great exploits but this is the tale of your triumphant return.",
    [start, about],
    defaultFunction
);

batFight.actions.push(batFight);
walk.actions.push(start);
caveExit.actions.push(cave, start);
vaccinate.actions.push(cave, start);
about.actions.push(titleScreen);

titleScreen.display();
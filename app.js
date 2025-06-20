// initialize card variables
// let 키워드로 변수를 정의한다.
let cards = [];
let cardTable = document.querySelector(".card-table"); // card-table 클래스를 가진 div를 가져온다.
let firstCard = null;
let secondCard = null;
let noFlipping = false; // flip을 할 수 있는지 없는지 // restrict user from flipping 3 or more cards at same time.
let chancesRemaining = 10; // set how many times the user can try match all cards, before losing

let winCounter = null; // will update this win counter on every match

let counter = document.querySelector(".tries-remaining")
let chanceBar = document.getElementById("chance-bar"); // progress bar를 가져옴

counter.textContent = chancesRemaining;

// implement the Fetch API to grab the card JSON file
// 파일에서 데이터를 가져와서, 자바스크립트가 쓸 수 있는 형태로 바꿔주는 과정
fetch("./data/card_info.json") // fetch() 파일을 요청하는 함수이다. fetch()는 "약속(Promise)"를 return한다다. 
    .then(Response => Response.json()) // then: 약속(promise)가 끝나고 나면, 그 결과를 가지고 다음 작업을 하라. Response라는 이름으로 응답을 받고 parsing한다.
    .then((data) => { // 파싱이 끝나면 객체를 data란 이름으로 받아온다. 
        winCounter = data.length;

        // Option 1 using MAP
        // const cardsWithMap = data.map(card => [card, card]).flat();
        // console.log(cardsWithMap);

        // Option 2 using flatmap()
        // const cardsWithFlatMap = data.flatMap(card => {
        //     return [card, card];
        // })
        // console.log(cardsWithFlatMap);

        // Option 3 (easiest)
        // 데이터를 갖고 cards 배열을 duplicate해서 만든다. 
        cards = [...data, ...data];

        // shuffle the cards. 
        let shuffledCards = shuffle();

        // deal our cards // 카드를 돌리다.
        dealCards(shuffledCards);


    })
    .catch((error) => {
        console.log("Error fetching card data: ", error)
    }
);// end fetch


// define shuffle function
function shuffle(){
    // create a copy of the cards array to avoid mutating the original array
    let shuffledCardsArray = [...cards];
    let totalCards = shuffledCardsArray.length;
    let currentIndex = totalCards - 1;

    // use Fisher-Yates (or Knuth) shuffle algorithm. This method is efficient and ensures that each possible permutation of the array has an equal probability of occurring.
    
    /** 
    // option 1
    // Loop through the array from the last element to the first
    
    for(currentIndex; currentIndex > 0; currentIndex--) {
        // Generate a random index between 0 and currentIndex (inclusive)
        let randomCardIndex = Math.floor(Math.random() * (currentIndex + 1));
        console.log("randomCardIndex: ", randomCardIndex);

        // Swap the elements at currentIndex and randomIndex using a temporary variable
        let randomCard = shuffledCardsArray[randomCardIndex];
        console.log("randomCard: ", randomCard);

        // replace the randomCard with the card at the currentIndex
        shuffledCardsArray[randomCardIndex] = shuffledCardsArray[currentIndex];
        console.log("shuffledCardsArrayStep1: ", [...shuffledCardsArray]);

        // replace the card at currentIndex with the randomCard
        shuffledCardsArray[currentIndex] = randomCard;
        console.log("shuffledCardsArrayStep2: ", [...shuffledCardsArray]);

    }
    */

    // option 2
    // Swap elements using destructuring assignment in JavaScript
    for(currentIndex; currentIndex > 0; currentIndex--) {
        // Generate a random index between 0 and currentIndex (inclusive)
        let randomCardIndex = Math.floor(Math.random() * (currentIndex + 1));
        [shuffledCardsArray[currentIndex], shuffledCardsArray[randomCardIndex]] = [shuffledCardsArray[randomCardIndex], shuffledCardsArray[currentIndex]];

    }
        
    return shuffledCardsArray;

}; //  end shuffle // 이렇게 각 괄호가 끝나는 부분에, 의미하는 것을 적어두면 알아보기 쉽겠다. 습관으로 만들자.

function dealCards(cards) {
    console.log('welcome to the random card game')

    let fragment = document.createDocumentFragment(); //  document.createDocumentFragment() returns a minimal document object with no parent
        

    // cards 배열을 for of 반복문으로 순회한다.
    for (const card of cards) {
        // OPTION 1: directly adding created elements to the DOM
        // #1. create the card wrapper, 문서 객체를 생성한다.
        // let cardElement = document.createElement("div"); // document 객체를 써서 DOM에 접근한다.
        // cardElement.classList.add("card"); // 클래스를 부여한다.
        // cardElement.setAttribute("data-name", card.name); // 속성을 부여한다.

        // // #2. add the front and back of the card
        // cardElement.innerHTML = `
        //     <div class="back">
        //         <img class="back-image" src="${card.image}.png">
        //     </div>
        //     <div class="front"></div>
        // `;

        // // 카드를 테이블에 연결한다.
        // cardTable.appendChild(cardElement);

        // Option 2: using fragments.
        // create our entire card
        // div class = card 요소를 새로 만든다.
        let cardElement = document.createElement("div"); 
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);

        // create both the front and back of the cards, seperately
        // Front of card
        // 카드 front 영역 div만든다.
        let frontCardDiv = document.createElement("div");
        frontCardDiv.classList.add("front");

        // Back of card
        // 카드 back 영역 div 만든다.
        let backCardDiv = document.createElement("div");
        backCardDiv.classList.add("back");

        // add image to the back of the card
        // 카드 back에 들어갈 img 태그 만든다.
        let img = document.createElement("img");
        img.classList.add("back-image");
        img.src = `${card.image}.png`;
        // 만든 img를 backCardDiv에 붙인다.
        backCardDiv.appendChild(img);

        // append front and back of the card, to the card itself.
        // 만든 cardElement안에 front와 back 모두 붙인다.
        cardElement.append(backCardDiv,frontCardDiv); // 먼저 불린 순서로 카드가 쌓여서, 커버가 보이게 하려면 front를 나중에 불러야한다.
        
        // attach card to the fragment
        // 최종적으로 만든 cardElement를 fragment 안에 담아둔다.
        fragment.appendChild(cardElement);

    } // end of the for loop

    // append the entire fragment to the live DOM
    // fragment 에 담긴 모든 카드 요소를 한 번에 실제 DOM에 붙인다.
    cardTable.appendChild(fragment);

    // Attach click event listeners after all cards are added
    let dealtCards = document.querySelectorAll('.card'); // 12개 카드를 모두 가져온다.
    // forEach: 배열을 순회회
    dealtCards.forEach(card => {

        card.addEventListener("click", flipCard);
    });
}; // end dealCards

function flipCard() {
    if(noFlipping) return; //  카드 2개 flip한 뒤 3번째 하려고 하면 함수 자체를 나간다. 

    // add a css class to activate the flip effect
    this.classList.add("flipped"); // 클래스를 부여한다.
    // prohibit user from clicking on the same card twice.
    if(this === firstCard) {
        alert("you must not click on the same card that you flipped over");
        return ;
    }

    // grab first card flipped over (clicked)
    if(!firstCard) {
        firstCard = this; // set the firstCard value to the div with class "card"
        // console.log("firstCard: ", firstCard);
        return; // exit out of this flipCard function and wait for user to flip another card
    }

    secondCard = this;
    // console.log("secondCard:", secondCard);

    noFlipping = true; // prevent user from clicking on more than 2 cards at once. 

    checkForMatch();

};// end filpCard

function checkForMatch() {
    let isMatch = (firstCard.dataset.name === secondCard.dataset.name); // boolean, indicating whether i have a match
    
    // the ternary operator in JavaScript
    isMatch ? matchCards() : unflipCards();

}; // end checkForMatch

function unflipCards() {
    setTimeout(() => {
        // examine whether the user has lost the game
        --chancesRemaining;
        counter.textContent = chancesRemaining;
        chanceBar.value = chancesRemaining; // progress bar 업데이트

        if(chancesRemaining === 0) {
            alert("You Lost");
            showImageOverlay();
            return;
        }

        // 뒤집는 CSS를 없애준다.
        firstCard.classList.remove("flipped");  
        secondCard.classList.remove("flipped");

        resetFlags(); // 리셋셋
    }, 1000);
    
    
}; // end unflipCards

function matchCards() {
    // reduce winCounter
    --winCounter;
    if(winCounter===0) {
        setTimeout(() => {
            alert("YOU WIN, PLEASE RESTART THE BROWSER");
            let starInterval = setInterval(fallingStar, 300); // Create a new star.

            setTimeout(() => {
            clearInterval(starInterval);
        }, 5000);
        
        }, 1000);
        
    }; 
    // remove the click event listener from our matched cards
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    // add a green color to matched cards
    setCardBackground(firstCard, "greenyellow");
    setCardBackground(secondCard, "greenyellow");
    // reset variables / flags
    resetFlags();

}; // end matchCards

function setCardBackground(card, color) {
    card.children[0].style.background = color;
}

function resetFlags() {
    firstCard = null;
    secondCard = null;
    noFlipping = false; // open up all ummatched cards to be flipped again
}; // end resetFlags

function showImageOverlay() {
    // create the div wrapper
    let wrapper = document.createElement("div");
    wrapper.classList.add("image-overlay"); // adding this class for CSS styling

    // create the image child
    let image = document.createElement("img");
    image.src = "./images/loser.jpg";
    // append the image as a child to the wrapper div
    wrapper.appendChild(image);

    // finally, attach the wrapper to the DOM
    document.body.appendChild(wrapper);

    //transition the opacity to 1
    requestAnimationFrame(() => {
        wrapper.style.opacity = 1;
    })

}; // showImageOverlay

// creating star function
function fallingStar() {
    let star = document.createElement("div");
    star.classList.add("star");
    // style star
    // set random horizontal position
    let randomX = Math.random() * window.innerWidth;
    star.style.left = `${randomX}px`; // style로 스타일을 지정한다.
    // set a random duration
    let duration = Math.random()*2 + 3;
    star.style.animationDuration =  `${duration}s`;

    // append star to its wrapper div / html 에 있는 star-wrapper를 이렇게 가져오는구나.
    document.getElementsByClassName("star-wrapper")[0].appendChild(star);

    // remove the star from the DOM, when the animation ends
    star.addEventListener('animationend', () => {
        star.remove();
    });
    
}; // fallingStar

// showImageOverlay();

/** Loadcards()
*/

/** 
async function LoadCards() {
    try{
        // fetch the JSON file, fetch는 요청을 보낼 때 쓴다. // await: response가 오길 기다려야한다. 
        let response = await fetch("./data/card_info.json");
        // response는 데이터를 가지고 있지만, 최종 데이터 형태는 아니라서 변환과정을 거쳐야함 
        // parse the JSON file, 파싱이란 어떤 형식으로 작성된 문자열 데이터를 다룰 수 있는 형태로 분석, 변환하는 과정을 뜻함
        let cardsArray = await response.json(); // 파싱하는 것도 await 해야한다.  // JSON : Java Script Object 형태로 바꾼다.
        console.log(cardsArray);


    }  catch(error){
        console.log(error);
    }
};
*/
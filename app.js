// initialize card variables
// let 키워드로 변수를 정의한다.
let cards = [];



// implement the Fetch API to grab the card JSON file
fetch("./data/card_info.json")
    .then(Response => Response.json())
    .then((data) => {
        // Option 1 using MAP
        // const cardsWithMap = data.map(card => [card, card]).flat();
        // console.log(cardsWithMap);

        // Option 2 using flatmap()
        // const cardsWithFlatMap = data.flatMap(card => {
        //     return [card, card];
        // })
        // console.log(cardsWithFlatMap);

        // Option 3 (easiest)
        cards = [...data, ...data];
        console.log(cards);


    })
    .catch((error) => {
        console.log("Error fetching card data: ", error)
    })


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
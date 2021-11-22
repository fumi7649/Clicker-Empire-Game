// ここからJavaScriptを記述してください。
config = {
  startPage : document.getElementById("startPage"),
  gamePage : document.getElementById("gamePage")
}



class User{
  constructor(userName, yrsOld, money, days, burgersClickCount, increasePerSec, burgerClickPower, itemObjects){
      this.userName = userName;
      this.yrsOld = yrsOld;
      this.money = money;
      this.days = days;
      this.burgersClickCount = burgersClickCount;
      this.increasePerSec = increasePerSec;
      this.burgerClickPower = burgerClickPower;
      this.itemObjects = itemObjects;
  }

  burgersAddCount(){
    this.burgersClickCount++;
    this.money += this.burgerClickPower;
    return this.burgersClickCount;
  }

  getOld(){
    return this.yrsOld++;
  }

  daylyProgress(){
        this.days++;
        this.money += this.increasePerSec;
  }

  shopping(amount){
    this.money -= amount;
  }

  calculationIncreasePerSecond(itemObj, purchaseQuantitiy){
    if(itemObj.type == "realEstate"){
      itemObj.quantity += purchaseQuantitiy;
      this.increasePerSec += itemObj.status * purchaseQuantitiy;
    }
    else if(itemObj.type == "investment"){
      if(itemObj.itemName == "ETF Stock"){
        itemObj.quantity += purchaseQuantitiy;
        itemObj.price = itemObj.price * 1.1;
        this.increasePerSec += itemObj.firstPrice * itemObj.quantity * 0.001;
      }
      if(itemObj.itemName == "ETF Bonds"){
        itemObj.quantity += purchaseQuantitiy;
        this.increasePerSec += itemObj.price * itemObj.quantity * 0.0007;
      }
    }
    else if(itemObj.type == "ability"){
      itemObj.quantity += purchaseQuantitiy;
      this.burgerClickPower += itemObj.status * purchaseQuantitiy;
      let oneclickAbility = document.querySelectorAll("#oneclickAbility")[0];
      oneclickAbility.innerHTML = 
        `
        one click ￥${this.burgerClickPower}
        `;
    }
  }
}

class Item {
  constructor(itemName, type, price, quantity, status,  maxPurchases,imgUrl, firstPrice){
      this.itemName = itemName;
      this.type = type;
      this.price = price;
      this.quantity = quantity;
      this.status = status;
      this.maxPurchases = maxPurchases;
      this.imgUrl =  imgUrl;
      this.firstPrice = firstPrice;
  }


  purchasedItem(user, purchaseQuantitiy){
    user.shopping(purchaseQuantitiy * this.price);
  }


}

class Controller {
  static displayNone(page){
    page.classList.remove("d-block");
    page.classList.add("d-none");

  }
  static displayBlock(page){
    page.classList.remove("d-block");
    page.classList.add("d-block");
  }
}

class View {
  static createInitialPage(){
    let container = document.createElement("div");
    container.classList.add("vh-100", "d-flex", "justify-content-center", "align-items-center");

    let whiteBox = document.createElement("div");
    whiteBox.classList.add("bg-white", "text-center", "p-4");
    whiteBox.innerHTML = 
        `
        <h2 class="pb-3">Clicker Emprie Game</h2>
        <form>
          <div class="form-row pb-3">
            <input type="text" class="form-control" placeholder="Your name" id="gameName">
          </div>
        </form>
        `;
    let controlBtn = View.backNextBtn("New", "Login");
    whiteBox.append(controlBtn);
    container.append(whiteBox);
    config.startPage.append(container);
    let inputName = whiteBox.querySelectorAll("#gameName")[0];

    let backBtn = container.querySelectorAll(".back-btn")[0];
    backBtn.addEventListener("click", function(){
        if(inputName.value == ""){
          alert("Please enter your name");
        }else{
          Controller.displayNone(config.startPage);
          let user = View.createUserAccount(inputName.value);
          console.log(user);
          View.createGamePage(user);
        }
       
        
    })

    let loginBtn = container.querySelectorAll(".next-btn")[0];
    loginBtn.addEventListener("click", function(){
      let saveData = localStorage.getItem(inputName.value);
      if(saveData == null){
        alert("There in no data.");
        return false;
      }
      else{
        saveData = JSON.parse(saveData);
        
        Controller.displayNone(config.startPage);
        let loginUserData = new User(saveData["userName"], saveData["yrsOld"], saveData["money"], saveData["days"], saveData["burgersClickCount"], saveData["increasePerSec"], saveData["burgerClickPower"],saveData["itemObjects"]);
        View.createGamePage(loginUserData);
      }
    })
  }

  
  static createUserAccount(userName){
    let user = new User(userName, 20, 50000, 0, 0, 0, 25, View.initialItemObjects());
    return user;
  }


  static createGamePage(user){
    let container = document.createElement("div"); 
    container.classList.add("d-flex", "justify-content-center");
    

    container.innerHTML = 
          
          `          
            <div class="d-flex justify-content-center align-items-center m-5 p-5>
              <div class="d-flex justify-content-center align-items-center p-5">
                <div class="col-md-11 col-lg-10 bg-green d-flex p-md-3 pb-5" style="height: 100vh;">
                  <div class="bg-dark col-4 m-2">
                    <div class="bg-green text-white text-center p-2 m-3">
                      <h5 id="burgersCounter">${user.burgersClickCount} Burgers</h5>
                      <p id="oneclickAbility">one click ￥${user.burgerClickPower}</p>
                    </div>
                    <div class="p-2 pt-5 d-flex justify-content-center">
                      <img src="https://cdn.pixabay.com/photo/2014/04/02/17/00/burger-307648_960_720.png" width="80%" class="py-2 cursor-pointer hover img-fluid" id="burger">
                    </div>
                  </div>
                  <div class="col-8">
                    <div class="bg-green p-1" id="userInfo">                
                    </div>
                    <div class="bg-dark overflow-auto flowHeight p-2 m-sm-0 m-3 rem1p1" id="displayItems">
                    </div>
                    <div class="text-white d-flex justify-content-end">
                    <i class="fas fa-redo fa-border" id="resetGame"></i>
                    <i class="far fa-save fa-border" id="userSave"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div> 
          `;
      
      

      let userInfo = container.querySelectorAll("#userInfo")[0];
      userInfo.innerHTML = 
          `
          <div class="d-flex flex-wrap p-1">
            <div class="text-center text-white col-6 border border-dark border-3">
              <p id="userName"> ${user.userName}</p>
            </div>
            <div class="text-center text-white col-6 border border-dark border-3">
              <p id="currYrsOld">${user.yrsOld} years old</p>
            </div>
            <div class="text-center text-white col-6 border border-dark border-3">
              <p id="currDays">${user.days} days</p>
            </div>
            <div class="text-center text-white col-6 border border-dark border-3">
              <p id="currMoney">￥${user.money}</p>
            </div>
          </div>
          `;
        
      let userSave = container.querySelectorAll("#userSave")[0];
      let resetGame = container.querySelectorAll("#resetGame")[0];

      userSave.addEventListener("click", function(){
        let userName = user.userName;
        user = JSON.stringify(user);
        localStorage.setItem(userName, user);
        alert("Saved your data, Please put the same when you login.");
        clearInterval(timer);
        container.innerHTML = "";
        Controller.displayBlock(config.startPage);
      })

      resetGame.addEventListener("click", function(){
          let nowUserName = user.userName;
          let reset = confirm("If your haven't saved the data, it will be lost, is that okey?");
          if(reset){
          container.innerHTML = "";
          let restartUser = View.createUserAccount(nowUserName);
          View.createGamePage(restartUser);
          }
      })
      


        let currYrsOld = container.querySelectorAll("#currYrsOld ")[0];
        let currDays = container.querySelectorAll("#currDays")[0];
        let currMoney = container.querySelectorAll("#currMoney")[0];
        let countSecond = 0;
      var timer = setInterval(function(){
        user.daylyProgress();
        countSecond++;
        if(countSecond == 365){
          countSecond = 1;
          user.getOld();
        }
        currYrsOld.innerHTML = user.yrsOld.toString() + " years old";
        currDays.innerHTML = user.days.toString() + " days";
        currMoney.innerHTML = "￥" + user.money.toString();

      },1000)

        let burger = container.querySelectorAll("#burger")[0];
        burger.addEventListener("click", function(){
          
            
          let burgersCounter = container.querySelectorAll("#burgersCounter")[0];
          user.burgersAddCount();
          burgersCounter.innerHTML = user.burgersClickCount.toString() + " Burgers";
          currMoney.innerHTML = "￥" + user.money.toString();   
        })

        burger.addEventListener("mousedown", () => {
          burger.classList.add("jump");
        })
        burger.addEventListener("animationend", ()=>{
          burger.classList.remove("jump");
        })
        burger.addEventListener("animationcancel", () => {
          burger.classList.remove("jump");
        })

      let displayItems = container.querySelectorAll("#displayItems")[0];
      let itemLists = View.createItemList(user);
      displayItems.append(itemLists);
      config.gamePage.append(container);

  }

  static divideOftypeString(itemObj){
    let typeString = "";
        if(itemObj.type == "realEstate")typeString = "sec";
        if(itemObj.type == "investment")typeString = "sec";
        if(itemObj.type == "ability")typeString = "click";

    return typeString;
  }

  static backNextBtn(back, next){
    let container = document.createElement("div");

    container.innerHTML =
    `
    <div class="d-flex justify-content-between">
        <div class="col-6 pl-0">
            <button class="btn btn-outline-primary back-btn col-12 bg-white">${back}</button>
        </div>
        <div class="col-6 pr-0">
            <button class="btn btn-primary next-btn col-12 ">${next}</button>
        </div>
    </div> 
    `
    return container;

  }

  static initialItemObjects(){
    const items = {
      flipmachine : new Item("Flip machine", "ability", 15000, 0, 25, 500, "https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png", 15000),
      etfstock : new Item("ETF Stock", "investment", 300000, 0, 0.1, Infinity, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png", 300000),
      etfbonds : new Item("ETF Bonds", "investment", 300000, 0, 0.07, Infinity, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png", 300000),
      lemonadestand : new Item("Lemonade Stand", "realEstate", 30000, 0, 30, 1000, "https://cdn.pixabay.com/photo/2012/04/15/20/36/juice-35236_960_720.png", 30000),
      iceCreamTruck : new Item("Ice Cream Truck", "realEstate", 100000, 0, 120, 500, "https://cdn.pixabay.com/photo/2020/01/30/12/37/ice-cream-4805333_960_720.png", 100000),
      house : new Item("House", "realEstate", 20000000, 0, 32000, 100, "https://cdn.pixabay.com/photo/2016/03/31/18/42/home-1294564_960_720.png", 20000000),
      townHouse : new Item ("TownHouse", "realEstate", 40000000, 0, 64000, 100, "https://cdn.pixabay.com/photo/2019/06/15/22/30/modern-house-4276598_960_720.png",40000000),
      mansion : new Item("Mansion", "realEstate", 250000000, 0, 500000, 20, "https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_960_720.png",250000000 ),
      industrial : new Item("Industrial", "realEstate", 1000000000, 0, 2200000, 10, "https://cdn.pixabay.com/photo/2012/05/07/17/35/factory-48781_960_720.png", 10000000000),
      hotel : new Item("Hotel", "realEstate", 10000000000, 0, 25000000, 5, "https://cdn.pixabay.com/photo/2012/05/07/18/03/skyscrapers-48853_960_720.png", 10000000000),
      skyrailway : new Item("Bullet-Speed Sky Railway", "realEstate", 10000000000000, 0, 30000000000, 1, "https://cdn.pixabay.com/photo/2013/07/13/10/21/train-157027_960_720.png", 10000000000000)
    
    }

    let itemObjects = [];

    for(let key in items){
      itemObjects.push(items[key]);
    }
    return itemObjects;
  }

  static createItemList(user){
    let container = document.createElement("div");

    for(let i = 0;i < user.itemObjects.length;i++){
      let typeString = this.divideOftypeString(user.itemObjects[i]);
      let itemsDiv = document.createElement("div");
       itemsDiv.innerHTML +=
          `
            <div class="item text-white d-sm-flex align-items-center bg-green m-1 hover">
              <div class="d-none d-sm-block p-1 col-sm-3">
                <img src=${user.itemObjects[i].imgUrl} class="img-fluid">
              </div>
              <div class="col-sm-9 ">
                <div class="d-flex justify-content-between rem1p3">
                  <h4>${user.itemObjects[i].itemName}</h4>
                  <p>${user.itemObjects[i].quantity}</p>
                </div>
                <div class="d-flex justify-content-between rem1p1">
                  <h5>￥${user.itemObjects[i].price}</h5>
                  <p class="text-primary">￥${user.itemObjects[i].status} / ${typeString}</p>
                </div>
              </div>
            </div>
          `;
        container.append(itemsDiv);
        itemsDiv.addEventListener("click", function(){
            container.innerHTML = "";
            container.append(View.purchasePage(user.itemObjects[i], user));  
        })      
    }
    
    return container;
    
  }


    static purchasePage(itemObj, user){
      let container = document.createElement("div");
      container.classList.add("bg-dark", "p-1", "m-sm-0", "m-2");
      let purchaseInfo = document.createElement("div");
      purchaseInfo.classList.add("d-flex","text-white", "bg-green","flex-column","p-5");
      let typeString = View.divideOftypeString(itemObj);
      purchaseInfo.innerHTML =
          `
          <div class="d-flex justify-content-between m-2">
            <div class="d-flex flex-column">
              <h4>${itemObj.itemName}</h4>
              <p>Max purchases: ${itemObj.maxPurchases}</p>
              <p>Price: ￥${itemObj.price}</p>
              <p>Get ￥${itemObj.status} / ${typeString}</p>
            </div>
            <img src=${itemObj.imgUrl} class="img-fluid img-width">
          </div>
          <div id="purchase">
            <p>How many wolud you like to buy ?</p>
            <form>
              <input type="number" placeholder="0" class="form-control" id="itemQuantity" min="0" max="${itemObj.maxPurchases}">
            </form>
            <p class="text-right" id="totalPrice">total: 0</p>
            <div id="purchaseBtn"></div>
          </div>
          `;
          
        let purchaseBtn = purchaseInfo.querySelectorAll("#purchaseBtn")[0];
        purchaseBtn.append(this.backNextBtn("Go Back", "Purchase"));
        let backBtn = purchaseBtn.querySelectorAll(".back-btn")[0];
        let nextBtn = purchaseBtn.querySelectorAll(".next-btn")[0];
        let itemQuantity = purchaseInfo.querySelectorAll("#itemQuantity")[0];
        let totalPrice = purchaseInfo.querySelectorAll("#totalPrice")[0];
        
        itemQuantity.addEventListener("change", function(){
            let totalPriceValue = itemQuantity.value * itemObj.price;
            totalPrice.innerHTML = "total: " + "￥" + totalPriceValue.toString();
        })
        
        

        backBtn.addEventListener("click", function(){
          container.innerHTML = "";
          let itemsList = View.createItemList(user);
          container.append(itemsList);
        })

        nextBtn.addEventListener("click", function(){
          let confirmPurchase = confirm("Would you like to buy this item ?");
          let totalPriceValue = parseInt(itemQuantity.value) * itemObj.price;
          if(confirmPurchase && totalPriceValue < user.money){
            itemObj.purchasedItem(user, parseInt(itemQuantity.value));
            user.calculationIncreasePerSecond(itemObj, parseInt(itemQuantity.value));
            container.innerHTML = "";
            let itemList =View.createItemList(user);
            container.append(itemList);
            if(itemObj.type == "ability"){
              let burgerImg = document.querySelectorAll("#burger")[0];
              burgerImg.classList.add("rotate");
              burgerImg.addEventListener("animationend",()=>{
                burgerImg.classList.remove("rotate");
              })
              burgerImg.addEventListener("animationcancel", () => {
                burgerImg.classList.remove("rotate");
              })
            }
          }else if(totalPriceValue > user.money){
            alert("Not enough money");
          }
        })

        container.append(purchaseInfo);
        return container;

    }

    
}

View.createInitialPage();
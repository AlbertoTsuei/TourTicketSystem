let data;
axios.get("https://raw.githubusercontent.com/AlbertoTsuei/TourTicketSystem/main/Data/travelAPI.json").then(function (response) {
  data = response.data;
  init();
  renderC3();
})
  .catch(function (error) {
    console.log(error);
  })
  ;

// 搜尋區
const list = document.querySelector(".ticketCard-area");  
const regionSearch = document.querySelector(".regionSearch"); 
const searchResulttext = document.querySelector("#searchResult-text");
let str = "";
let searchNum = 0; 

// 初始化
function init() {
  str = ""; 
  searchNum = 0; 
  data.forEach(function (item) {
    searchNum++;
    str += `
<li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img src="${item.imgUrl}" alt="">
          </a>
          <div class="ticketCard-region">${item.area}</div>
          <div class="ticketCard-rank">${item.rate}</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${item.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">$${item.price}</span>
            </p>
          </div>
        </div>
      </li>
`;
  })
  list.innerHTML = str;
  searchResulttext.innerHTML = `本次搜尋共 ${searchNum} 筆資料`;
};

regionSearch.addEventListener("change", function (e) {
  str = ""; 
  let searchNum = 0; 
  data.forEach(function (item) {
    if (e.target.value == "全部") {
      searchNum++;
      str += `
<li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img src="${item.imgUrl}" alt="">
          </a>
          <div class="ticketCard-region">${item.area}</div>
          <div class="ticketCard-rank">${item.rate}</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${item.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">$${item.price}</span>
            </p>
          </div>
        </div>
      </li>
`;
    }
    else if (e.target.value == item.area) {
      searchNum++;
      str += `
<li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img src="${item.imgUrl}" alt="">
          </a>
          <div class="ticketCard-region">${item.area}</div>
          <div class="ticketCard-rank">${item.rate}</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${item.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">$${item.price}</span>
            </p>
          </div>
        </div>
      </li>
`;
    }
  });
  if (searchNum == 0){
    str =`
    <div class="cantFind-area">
    <h3>查無此關鍵字資料</h3>
    <img src="https://i.imgur.com/dZI8FJQ.png" alt="">
    </div>
    `
  }
  list.innerHTML = str;
  searchResulttext.innerHTML = `本次搜尋共 ${searchNum} 筆資料`;

});

// 新增區
const ticketName = document.querySelector("#ticketName"); 
const ticketImgUrl = document.querySelector("#ticketImgUrl"); 
const ticketRegion = document.querySelector("#ticketRegion"); 
const ticketPrice = document.querySelector("#ticketPrice"); 
const ticketNum = document.querySelector("#ticketNum"); 
const ticketRate = document.querySelector("#ticketRate"); 
const ticketDescription = document.querySelector("#ticketDescription"); 

const addTicketBtn = document.querySelector(".addTicket-btn"); 

addTicketBtn.addEventListener("click", function (e) {
  let obj = {};
  obj.name = ticketName.value;
  obj.imgUrl = ticketImgUrl.value;
  obj.area = ticketRegion.value;
  obj.price = Number(ticketPrice.value);
  obj.group = Number(ticketNum.value);
  obj.rate = Number(ticketRate.value);
  obj.description = ticketDescription.value;
  data.push(obj);
  init();
  renderC3();
  ticketName.value = "";
  ticketImgUrl.value = "";
  ticketRegion.value = "";
  ticketPrice.value = "";
  ticketNum.value = "";
  ticketRate.value = "";
  ticketDescription.value = "";
})

//圖表
function renderC3() {
  // 根據c3 input資料需求進行資料格式處理
  // 篩選地區，並累加數字上去
  // totalObj 會變成 {高雄: 1, 台北: 1, 台中: 1}
  let totalObj = {};
  data.forEach(function (item, index) {
    if (totalObj[item.area] == undefined) {
      totalObj[item.area] = 1;
    } else {
      totalObj[item.area] += 1;
    }
  })
  let newData = [];
  let area = Object.keys(totalObj);
  // area output ["高雄","台北","台中"]
  area.forEach(function (item, index) {
    let ary = [];
    ary.push(item);
    ary.push(totalObj[item]);
    newData.push(ary);
  })
  // newData = [["高雄", 1], ["台北",1], ["台中", 1]]

  // c3 產生器
  const chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: newData,
      type: 'donut',
    },
    donut: {
      title: "套票地區比重",
      label: {
        show: false //不顯示%數
      },
      width: 20
    }
  });

}
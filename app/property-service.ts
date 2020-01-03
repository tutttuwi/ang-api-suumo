import request = require("request-promise");
import { rejects } from "assert";
const { JSDOM } = require("jsdom");

export class PropertyApi {
  constructor() {}
  apiname: string = "propertyapi";
  public async getSuumoProperty(url: string): Promise<Object> {
    console.log("----- class start time : " + new Date().toISOString());
    console.log(url);
    let result = {};
    await request({
      method: "GET",
      uri: url
    })
      .then(body => {
        try {
          console.log("--- start time : " + new Date().toISOString());
          console.log("--- response body : " + JSON.stringify(body).substring(0, 100));
          const dom = new JSDOM(body);
          console.log("--- time(after new jsdom) : " + new Date().toISOString());
          let res = {
            id: "",
            url: "",
            title: "",
            feeinfo: "",
            imgurl: "",
            place: "",
            tostation: "",
            floorplan: "",
            age: "",
            direction: "",
            area: "",
            floor: "",
            buildingtype: "",
            bkdtoption: "",
            overview: {}
          };
          res.title = dom.window.document.querySelector(".section_h1-header-title").textContent;
          res.url = url;
          res.feeinfo = dom.window.document.querySelector(".property_view_note-info").textContent;
          res.imgurl = dom.window.document
            .querySelector("#js-view_gallery-list")
            .getElementsByTagName("img")[1]
            .getAttribute("data-src");
          console.log(
            "----- imgurl : " +
              dom.window.document
                .querySelector("#js-view_gallery-list")
                .getElementsByTagName("img")[1]
                .getAttribute("data-src")
          );
          console.log("--- time(after pickup title,url,feeinfo,imgurl) : " + new Date().toISOString());
          let f_trs = dom.window.document.querySelector(".property_view_table").getElementsByTagName("tr");
          for (let i = 0; i < f_trs.length; ++i) {
            let h1 = f_trs[i].getElementsByTagName("th")[0] ? f_trs[i].getElementsByTagName("th")[0] : "";
            let h2 = f_trs[i].getElementsByTagName("th")[1] ? f_trs[i].getElementsByTagName("th")[1] : "";
            // console.log("----- count: " + i + " 行目");
            // console.log("--- h1: textcontent:" + h1);
            // console.log("--- h2: textcontent:" + h2);
            if (h1.textContent == "所在地") {
              console.log("--- place :set");
              console.log("-- tag :" + f_trs[i].getElementsByTagName("td")[0]);
              res.place = f_trs[i].getElementsByTagName("td")[0].textContent;
            } else if (h1.textContent == "駅徒歩") {
              res.tostation = f_trs[i].getElementsByTagName("td")[0].textContent;
            } else if (h1.textContent == "間取り") {
              res.floorplan = f_trs[i].getElementsByTagName("td")[0].textContent;
            } else if (h1.textContent == "築年数") {
              res.age = f_trs[i].getElementsByTagName("td")[0].textContent;
            } else if (h1.textContent == "向き") {
              res.direction = f_trs[i].getElementsByTagName("td")[0].textContent;
            }
            if (h2.textContent == "専有面積") {
              res.area = f_trs[i].getElementsByTagName("td")[1].textContent;
            } else if (h2.textContent == "階") {
              res.floor = f_trs[i].getElementsByTagName("td")[1].textContent;
            } else if (h2.textContent == "建物種別") {
              res.buildingtype = f_trs[i].getElementsByTagName("td")[1].textContent;
            }
          }
          res.bkdtoption = dom.window.document.querySelector(".bgc-wht.ol-g").textContent;

          console.log("--- time(before stringify) : " + new Date().toISOString());
          result = JSON.stringify(res)
            .split("\\t")
            .join("")
            .split("\\n.*?")
            .join("\\n");
          console.log("result : " + result);
          console.log("--- start end : " + new Date().toISOString());
        } catch (err) {
          console.log("-----error(then) : " + JSON.stringify(err));
        }
      })
      .catch(err => {
        console.log(JSON.stringify("-----error(catch) :" + err));
        result = {};
      });
    console.log("----- class end time : " + new Date().toISOString());
    return result;
  }
}

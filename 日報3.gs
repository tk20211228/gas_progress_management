//2022/06/22　修正対応
function checkDay(activeSheet){
  //日報出力する日付を取得
  const selectValue = activeSheet.getActiveRange().getValue();
  const data_judge = isNaN((new Date(selectValue)).getDate());
  console.log(data_judge);
  if(data_judge) {
      var day_answer = Browser.msgBox('選択した日付が正しく取得できませんでした。\\n処理を継続しますか？', Browser.Buttons.YES_NO);
    }
  //日付取得に失敗し処理を継続しない場合
  if(day_answer === 'no') {
      try{
        var day =Utilities.formatDate(selectValue, "Asia/Tokyo", "yyyy/MM/dd");
        }catch(day){
          console.log(day);
          const body = '<p>出力したい日付を選択し、実行してください。</p><p>【エラー内容】</p>'+day;
          createError(body);
        }finally{
          return;
        }
    //処理に成功している場合
    }else if(!data_judge){
      var day = Utilities.formatDate(selectValue, "Asia/Tokyo", "yyyy/MM/dd");
    //日付取得に失敗し、処理を継続する場合
    }else{
       var day = "yyyy/MM/dd";
    }
  
  return day;

}

//2022/05/18　修正対応
function createBody(myName){
  const activeSheet = SpreadsheetApp.getActiveSheet();
  //日報出力する日付を取得
  let day = checkDay(activeSheet);
  if(!day) return;

  //題名を作成する。のちほど、メールの件名として扱う
  const subject = '[MDM]【日報】'+ myName[1] + '\ ' + day;

  //進捗表から検索対象の値を取得する。
  const activeRange = activeSheet.getActiveRange();
  const selectRow = activeRange.getRow();
  const selectColumn = activeRange.getColumn();

  //全作業計画取得
  const selectAllPlanVlales = activeSheet.getRange(selectRow,2,14,415).getValues();
  // console.log(selectAllPlanVlales);

  //本日の作業実績のインデックス値を取得
  const todayAchievementNo = selectColumn - 2;

  //翌日の作業予定のインデックス値を取得
  const tasklistNest = [...selectAllPlanVlales[4]];
  tasklistNest.splice(0,todayAchievementNo+1);
  // console.log(tasklistNest);
  var selectNexstColumnNo = tasklistNest.findIndex(currentValue => currentValue > 0);
  console.log(selectNexstColumnNo);
  if(selectNexstColumnNo == -1){
    const taslListPlanNest = [...selectAllPlanVlales[2]];
    taslListPlanNest.splice(0,todayAchievementNo+1);
    console.log(taslListPlanNest);
     var selectNexstColumnNo = taslListPlanNest.findIndex(currentValue => currentValue > 0);
    //  var selectNexstColumnNo = 0;
  }
  if(selectNexstColumnNo == -1){
     var selectNexstColumnNo = 0;
  }

  console.log(selectNexstColumnNo);
  const nexstdayAchievementNo = selectNexstColumnNo+todayAchievementNo+1;
  console.log(nexstdayAchievementNo);

  //日報に必要な日付データをループ処理でフォーマット変換させる。
  //開始予定,完了予定
  let dayDete = [selectAllPlanVlales[1][1],selectAllPlanVlales[1][2]];
  console.log(dayDete);
  console.log(dayDete.length);
  for(b=0;b<dayDete.length;++b){
    if(dayDete[b]){
      // var deta = Utilities.formatDate(dayDete[b], "Asia/Tokyo", "yyyy/MM/dd");
      var deta = Utilities.formatDate(dayDete[b], "Asia/Tokyo", "yyyy-MM-dd");
      dayDete[b] = deta;
    }else{
      var deta = 'なし';
      dayDete[b] = deta;
    }
  }
  console.log(dayDete);

  let bodyItem = {
    destination                :['test@test.co.jp','宛先'],
    subject                    :[subject,'件名'],
    familyName                 :[myName[0],'担当者'],//
    taskName                   :[selectAllPlanVlales[1][0],'タスク名'],// 

    startDay                   :[dayDete[0],'開始日'],//
    completeDay                :[dayDete[1],'完了日'],// 
    // totalUsingItem          :[Number(selectAllPlanVlales[3][7]),'総消化項目'],// 
    totalItems                 :[Number(selectAllPlanVlales[1][7]),'総項目数'],// 
    // totalActualTime         :[Number(selectAllPlanVlales[4][7]),'総実工数'],// 
    planTotalTime              :[Number(selectAllPlanVlales[2][7]),'予定総工数'],// 

    today                      :['',' 本日の作業実績 [ 実績 ] / [ 目標 ] '],

    todayActualItem            :[Number(selectAllPlanVlales[3][todayAchievementNo]),'消化項目'],// 実績(本日)
    todayPlanUsingItem         :[Number(selectAllPlanVlales[1][todayAchievementNo]),'予定項目数'],// 計画(本日)
    todayActualTime            :[Number(selectAllPlanVlales[4][todayAchievementNo]),'実工数'],// 実績(本日)
    todayPlanUsingTime         :[Number(selectAllPlanVlales[2][todayAchievementNo]),'予定工数'],// 計画(本日)

    todayTotalActualItem       :[Number(selectAllPlanVlales[6][todayAchievementNo]),'累積項目数'],// 実績(本日)
    todayTotalPlanUsingItem    :[Number(selectAllPlanVlales[5][todayAchievementNo]),'累積項目数'],// 計画(本日)
    todayTotalActualTime       :[Number(selectAllPlanVlales[8][todayAchievementNo]),'累積時間'],// 実績(本日)
    todayTotalPlanUsingTime    :[Number(selectAllPlanVlales[7][todayAchievementNo]),'累積時間'],// 計画(本日)
    todayMemo                  :[selectAllPlanVlales[13][todayAchievementNo],'メモ'],// 

    tomorrow                   :['',' 明日の作業予定 [ 実績 ] / [ 目標 ] '],

    tomorrowActualItem         :[Number(selectAllPlanVlales[3][nexstdayAchievementNo]),'消化項目'],// 実績(明日)
    tomorrowPlanUsingItem      :[Number(selectAllPlanVlales[1][nexstdayAchievementNo]),'予定項目数'],// 計画(明日)
    tomorrowActualTime         :[Number(selectAllPlanVlales[4][nexstdayAchievementNo]),'実工数'],// 実績(明日)
    tomorrowPlanUsingTime      :[Number(selectAllPlanVlales[2][nexstdayAchievementNo]),'予定工数'],// 計画(明日)

    tomorrowTotalActualItem    :[Number(selectAllPlanVlales[6][nexstdayAchievementNo]),'累積項目数'],// 実績(明日)
    tomorrowTotalPlanUsingItem :[Number(selectAllPlanVlales[5][nexstdayAchievementNo]),'累積項目数'],//計画 (明日)
    tomorrowTotalActualTime    :[Number(selectAllPlanVlales[8][nexstdayAchievementNo]),'累積時間'],// 実績(明日)
    tomorrowTotalPlanUsingTime :[Number(selectAllPlanVlales[7][nexstdayAchievementNo]),'累積時間'],// 計画(明日)
    tomorrowMemo               :[selectAllPlanVlales[13][nexstdayAchievementNo],'メモ'],// 

    };
    // console.log(bodyItem);
  var addBody = '';
  for( key in bodyItem ) {
    // console.log( bodyItem[key] );
    if(bodyItem[key][1] === 'メモ') continue;
    if(bodyItem[key][1] === '開始日'||bodyItem[key][1] === '完了日'){
      let body = `<label for="${key}" class="col-sm-2 col-form-label">${bodyItem[key][1]}</label><div class="col-sm-4 mb-2"><input type="date" class="form-control text-end" id="${key}" v-model="bodyItem.${key}[0]"></div>`;
      addBody += body;
    }else if(bodyItem[key][1] === '宛先'||bodyItem[key][1] === '件名'||bodyItem[key][1] === '担当者'||bodyItem[key][1] === 'タスク名'){
      let body = `<label for="${key}" class="col-sm-2 col-form-label">${bodyItem[key][1]}</label><div class="col-sm-10 mb-2"><input type="text" class="form-control" id="${key}" v-model="bodyItem.${key}[0]"></div>`;
      addBody += body;
    }else if(bodyItem[key][1] === ' 本日の作業実績 [ 実績 ] / [ 目標 ] '|| bodyItem[key][1] === ' 明日の作業予定 [ 実績 ] / [ 目標 ] '){
      let body = `<div class="d-flex justify-content-center mb-2">-----------------${bodyItem[key][1]}-----------------</div>`;
      addBody += body;
    }
    else if(bodyItem[key][1] === '累積項目数'||bodyItem[key][1] === '累積時間'){
      let body = `<label for="${key}" class="col-sm-3 col-form-label">${bodyItem[key][1]}</label><div class="col-sm-3 mb-2"><input type="number" class="form-control text-end" id="${key}" v-model="bodyItem.${key}[0]" :value="${key}" min="0"></div>`;
      addBody += body;
    }
    else{
      let body = `<label for="${key}" class="col-sm-3 col-form-label">${bodyItem[key][1]}</label><div class="col-sm-3 mb-2"><input type="number" class="form-control text-end" id="${key}" v-model="bodyItem.${key}[0]" min="0"></div>`;
      addBody += body;
      };
    };
  bodyItem['addBody'] = addBody;
  // console.log(bodyItem);
  return bodyItem;
}


//2022/06/22　修正対応
function newCreateReportVer_1(){
  //ユーザーの性と姓名を取得
  const myName = getMyname();

  ///メールの内容を作成
  var bodyItem = createBody(myName);
  if(!bodyItem) return;

  let title = bodyItem.subject[0];
  
  var output = HtmlService.createTemplateFromFile('index3');
  output.bodyItemJSON = JSON.stringify(bodyItem);
  output.bodyItem = bodyItem;
  output.inputsub = title;
  output.inputCss = HtmlService.createHtmlOutputFromFile('css').getContent();
  output.inputJs = HtmlService.createHtmlOutputFromFile('js').getContent();

  var html = output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .setWidth(1100)
  .setHeight(790);
  SpreadsheetApp.getUi().showModelessDialog(html, title);

};
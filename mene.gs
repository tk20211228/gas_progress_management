function onOpen(){
    var meinUI = SpreadsheetApp.getUi();
      meinUI
        .createMenu('日報（BetaTest中）')
           .addItem('日報作成（BetaTest中）', 'newCreateReportVer_1')
          //  .addItem('開始日報作成','b')
        .addToUi();
      meinUI
        .createMenu('進捗入力アイテム（BetaTest中）')
        // .addItem('「進捗入力（空）を作成」', 'c')//マクロ.gsで管理
        .addItem('全体把握から進捗入力を作成（BetaTest中）', 'inputPlanCells')//lib.gsで管理
        .addToUi();
      meinUI
        .createMenu('メンテナンス') 
        .addItem('ユーザー名確認', 'myName')//メンテナンス.gsで管理
        .addItem('選択範囲の位置を取得', 'mygetRowcolumnActiveRange')//メンテナンス.gsで管理
        .addItem('getRangeで使用できる選択範囲の位置','mygetRowcolumnActiveRange0530')//メンテナンス.gsで管理//
        .addItem('プロパティ確認','openCheck')//propで管理
        .addToUi();
};
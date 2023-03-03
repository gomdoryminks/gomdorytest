/* Korean initialisation for the jQuery calendar extension. */
/* Written by DaeKwon Kang (ncrash.dk@gmail.com), Edited by Genie and Myeongjin Lee. */
( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "../widgets/datepicker" ], factory );
	} else {

		// Browser globals
		factory( jQuery.datepicker );
	}
}( function( datepicker ) {

datepicker.regional.ko = {
	closeText: "닫기", //닫기 버튼 패널
	prevText: "이전달", //prev 아이콘의 툴팁
	nextText: "다음달", //next 아이콘의 툴팁
	currentText: "오늘", //오늘 날짜로 이동하는 버튼 패널
	monthNames: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 Tooltip 텍스트
	monthNamesShort: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 텍스트
	dayNames: [ "일요일","월요일","화요일","수요일","목요일","금요일","토요일" ], //달력의 요일 부분 Tooltip 텍스트
	dayNamesShort: [ "일","월","화","수","목","금","토" ], //달력의 요일 부분 텍스트
	dayNamesMin: [ "일","월","화","수","목","금","토" ], //달력의 요일 부분 텍스트
	weekHeader: "주",
	dateFormat: "yy-mm-dd", //텍스트 필드에 입력되는 날짜 형식
	firstDay: 0,
	isRTL: false,
	showMonthAfterYear: true, //년도 먼저 나오고, 뒤에 월 표시
    changeYear: false, //콤보박스에서 년 선택 가능
    changeMonth: false, //콤보박스에서 월 선택 가능  
	yearSuffix: "년", //달력의 년도 부분 뒤에 붙는 텍스트
    yearRange: "-100:+10", //콤보박스에서 출력할 년 범위
    showButtonPanel: false //하단에 버튼 패널을 표시 
};
datepicker.setDefaults( datepicker.regional.ko );

return datepicker.regional.ko;

} ) );
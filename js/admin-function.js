//20230210 수정부분 start
//차트관련 항목
const chartBackgroundColor = ['rgba(255,99,132,0.5)', 'rgba(255,159,64,0.5)', 'rgba(255,205,86,0.5)', 'rgba(75,192,192,0.5)', 'rgba(54,162,235,0.5)', 'rgba(153,102,255,0.5)', 'rgba(201,203,207,0.5)'];
const chartBorderColor = ['rgba(255,99,132,1)', 'rgba(255,159,64,1)', 'rgba(255,205,86,1)', 'rgba(75,192,192,1)', 'rgba(54,162,235,1)', 'rgba(153,102,255,1)', 'rgba(201,203,207,1)'];

let statsCtx;
let statsChart;
//20230210 수정부분 end

//20230213 수정부분 start
//정규식 체크
const chkIdExp = RegExp(/^[A-Za-z0-9_\-]{6,12}$/);
const chkpwExp = RegExp(/^[A-Za-z0-9_\-]{8,20}$/);
const chkEmailExp = RegExp(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i);
const chkPhoneExp = RegExp(/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/);
const chkCorporateExp = RegExp(/^[0-9]{3}-[0-9]{2}-[0-9]{5}$/);
const chkNumberExp = RegExp(/^[0-9-]*$/);
//20230213 수정부분 end

$(function() {
    //리사이즈
    $(window).resize(function() {
        //20230303 수정부분 start
        //모바일에서 100vh 오류 해결방법
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        //20230303 수정부분 end
    });
    
    //20230303 수정부분 start
    //모바일에서 100vh 오류 해결방법
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    //20230303 수정부분 end
    
    //20230213 수정부분 start
    //숫자만 입력
    $("input[type='tel']").on("keyup", function(e) {
         $(this).val($(this).val().replace(/[^0-9-]/g,""));
    });
    
    //파일 업로드시 파일명 추출 및 파일삭제 버튼 노출
    $(".c-file-input input[type='file']").on("change", function(e) {
        var fileObj = $(this).closest(".c-file-input");
        var fileName = "";
        var fileHtml = "";
        
        $(fileObj).find("label").css("display","inline-block");
        $(fileObj).find(".c-file-btn").remove();
        
        if ($(this).val() != "") {
            if (window.FileReader) {
                //기본 브라우저
                fileName = $(this)[0].files[0].name;
            } else {
                //old IE
                fileName = $(this).val().split('/').pop().split('\\').pop();
            }
            
            fileHtml += "<button type='button' class='c-file-btn' onclick='delFile(this);'>";
            fileHtml += "    <span>파일삭제</span>";
            fileHtml += "</button>";
            
            $(fileObj).find("label").css("display","none");
            $(fileObj).append(fileHtml);
        }
        
        $(fileObj).find(".c-file-txt").val(fileName);
    });
    //20230213 수정부분 end
    
    //상단 대메뉴의 하위메뉴 보이기&숨기기
    $("nav.nav").on("mouseover", function(e) {
        e.preventDefault();
        
        var dataMenu = $("nav.nav .n-menu-list>li:hover").attr("data-menu");
        
        if (dataMenu != undefined && dataMenu != "") {
            var dataLink = $("nav.nav .nav-sub .n-sub-menu-area[data-menu='" + dataMenu + "']").attr("data-link");
            
            //data-link 값이 없을 경우 하위메뉴 보이고 data-link 값이 있을 경우 하위메뉴 숨기기
            if (dataLink != undefined && dataLink != "") {
                $("nav.nav .n-menu-list>li").removeClass("on");
                $("nav.nav .nav-sub").removeClass("on");
                $("nav.nav .nav-sub .n-sub-menu-area").removeClass("on");
            } else {
                $("nav.nav .n-menu-list>li").removeClass("on");
                $("nav.nav .n-menu-list>li[data-menu='" + dataMenu + "']").addClass("on");
                $("nav.nav .nav-sub").addClass("on");
                $("nav.nav .nav-sub .n-sub-menu-area").removeClass("on");
                $("nav.nav .nav-sub .n-sub-menu-area[data-menu='" + dataMenu + "']").addClass("on");
            }
        }
    });
    
    //상단 대메뉴의 하위메뉴 숨기기
    $("nav.nav").on("mouseleave", function(e) {
        e.preventDefault();
        
        $("nav.nav .n-menu-list>li").removeClass("on");
        $("nav.nav .nav-sub").removeClass("on");
        $("nav.nav .nav-sub .n-sub-menu-area").removeClass("on");
    });
    
    //상단 대메뉴 페이지 이동하기
    $("nav.nav .n-menu-list>li").on("click", function(e) {
        e.preventDefault();
        
        var dataMenu = $(this).attr("data-menu");
        
        if (dataMenu != undefined && dataMenu != "") {
            var dataLink = $("nav.nav .nav-sub .n-sub-menu-area[data-menu='" + dataMenu + "']").attr("data-link");
            
            if (dataLink != undefined && dataLink != "") {
                location.href = dataLink;
            }
        }
    });
    
    //목록에 링크가 있을 경우 해당 링크로 페이지 이동하기
    $(".list-table-area .list-table tr[data-link]").on("click", function(e) {
        var tagName = e.target.tagName.toLowerCase();
        var dataLink = $(this).attr("data-link");
        
        if (tagName == "th" || tagName == "td") {
            e.preventDefault();
            
            location.href = dataLink;
        }
    });
    
    //탭이 있을 경우 첫번째 탭 클릭하기
    $(".c-tab-area").each(function() {
        var tabObj = $(this).find(".c-tab-list").children("li").eq(0);
        
        if ($(tabObj).length > 0) {
            setTabItem($(tabObj));
        }
    });
    
    //탭 클릭시 해당 탭 내용 보이기
    $(".c-tab-area .c-tab-list>li").on("click", function(e) {
        setTabItem($(this));
    });
    
    //통계관리 일자 검색조건 선택하기
    if ($(".stats-date-area").length > 0) {
        setStatsDate($(".stats-date-area").find(".stats-date-select"));
    }
    
    //20230210 수정부분 start
    //통계관리 차트 그리기
    if ($(".stats-chart-area").length > 0) {
        setStatsChart();
    }
    //20230210 수정부분 end
    
    //20230213 수정부분 start
    //로딩시 입력폼 유효성 체크하기
    $(".valid-form-area .valid-form-tit label").each(function() {
        var formTitObj = $(this).closest(".valid-form-tit");
        
        if ($(formTitObj).length > 0) {
            chkFormValid(formTitObj);
        }
    });
    
    //입력시 입력폼 유효성 체크하기
    $(".valid-form-area .valid-form-con input,.valid-form-area .valid-form-con select,.valid-form-area .valid-form-con textarea").on("propertychange change keyup paste input", function() {
        var formTitObj = $(this).closest(".valid-form-con").prev(".valid-form-tit");
        
        if ($(formTitObj).length > 0) {
            chkFormValid(formTitObj);
        }
    });
    //20230213 수정부분 end
    
    //20230220 수정부분 start
    //로딩시 공지사항에서 공지기간 활성화여부 설정
    if ($(".notice-period-area").length > 0) {
        setNoticePeriod($(".notice-period-area #notice-period"));
    }
    //20230220 수정부분 end
    
    //datepicker 설정
    $(".date-input").each(function() {
        $(this).datepicker();
    });
    
    //datepicker 설정
    $(".start-date-input").each(function() {
        $(this).datepicker({
            onSelect: function(selectedDate) {
                $(this).siblings(".end-date-input").datepicker("option","minDate",selectedDate);
            }
        });
    });
    
    //datepicker 설정
    $(".end-date-input").each(function() {
        $(this).datepicker({
            onSelect: function(selectedDate) {
                $(this).siblings(".start-date-input").datepicker("option","maxDate",selectedDate);
            }
        });
    });
    
    //20230221 수정부분 start
    //datetimepicker 설정
    $(".datetime-input").each(function() {
        $(this).datetimepicker({
            controlType: "select",
            showButtonPanel: false
        });
    });
    
    //datetimepicker 설정
    $(".start-datetime-input").each(function() {
        $(this).datetimepicker({
            controlType: "select",
            showButtonPanel: false,
            onSelect: function(selectedDate) {
                $(this).siblings(".end-datetime-input").datetimepicker("option","minDate",selectedDate);
            }
        });
    });
    
    //datetimepicker 설정
    $(".end-datetime-input").each(function() {
        $(this).datetimepicker({
            controlType: "select",
            showButtonPanel: false,
            onSelect: function(selectedDate) {
                $(this).siblings(".start-datetime-input").datetimepicker("option","maxDate",selectedDate);
            }
        });
    });
    //20230221 수정부분 end
    
    //monthpicker 설정
    $(".month-input").each(function() {
        $(this).monthpicker({
            closeText: "닫기", //닫기 버튼 패널
            prevText: "이전달", //prev 아이콘의 툴팁
            nextText: "다음달", //next 아이콘의 툴팁
            currentText: "오늘", //오늘 날짜로 이동하는 버튼 패널
            monthNames: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 Tooltip 텍스트
            monthNamesShort: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 텍스트
            dateFormat: "yy-mm", //텍스트 필드에 입력되는 날짜 형식
            isRTL: false,
            yearSuffix: "년"
        });
    });
    
    //20230210 수정부분 start
    //monthpicker 설정
    $(".start-month-input").each(function() {
        $(this).monthpicker({
            closeText: "닫기", //닫기 버튼 패널
            prevText: "이전달", //prev 아이콘의 툴팁
            nextText: "다음달", //next 아이콘의 툴팁
            currentText: "오늘", //오늘 날짜로 이동하는 버튼 패널
            monthNames: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 Tooltip 텍스트
            monthNamesShort: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 텍스트
            dateFormat: "yy-mm", //텍스트 필드에 입력되는 날짜 형식
            isRTL: false,
            yearSuffix: "년",
            onSelect: function(selectedDate) {
                $(this).siblings(".end-month-input").monthpicker("option","minDate",selectedDate);
            }
        });
    });
    
    //monthpicker 설정
    $(".end-month-input").each(function() {
        $(this).monthpicker({
            closeText: "닫기", //닫기 버튼 패널
            prevText: "이전달", //prev 아이콘의 툴팁
            nextText: "다음달", //next 아이콘의 툴팁
            currentText: "오늘", //오늘 날짜로 이동하는 버튼 패널
            monthNames: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 Tooltip 텍스트
            monthNamesShort: [ "1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월" ], //달력의 월 부분 텍스트
            dateFormat: "yy-mm", //텍스트 필드에 입력되는 날짜 형식
            isRTL: false,
            yearSuffix: "년",
            onSelect: function(selectedDate) {
                $(this).siblings(".start-month-input").monthpicker("option","maxDate",selectedDate);
            }
        });
    });
    //20230210 수정부분 end
    
    //yearpicker 설정
    $(".year-input").each(function() {
        $(this).yearpicker();
    });
    
    //20230221 수정부분 start
    //맵에서 레이어창 이동가능하게 설정
    $(".c-map .map-layer").each(function() {
        $(this).draggable({
            containment: ".c-map",
            handle: ".map-layer-tit-area"
        }).mousedown(function() {
            var mapLayerObj = $(this);
            var maxIndex = 9;
            $(".map-layer.on").each(function() {
                if (parseInt($(this).attr("data-max-index")) >= maxIndex && mapLayerObj[0] !== $(this)[0]) {
                    maxIndex = parseInt($(this).attr("data-max-index")) + 1;
                }
            });
            
            $(this).css("z-index", maxIndex);
            $(this).attr("data-max-index", maxIndex);
        });
    });
    //20230221 수정부분 end
});

//20230213 수정부분 start
//선택한 파일 삭제
function delFile(obj) {
    var fileObj = $(obj).closest(".c-file-input");
    var fileId = $(fileObj).find("input[type='file']").attr("id");
    var fileName = $(fileObj).find("input[type='file']").attr("name");
    var fileHtml = "";
    
    $(obj).remove();
    $(fileObj).find("label").remove();
    $(fileObj).find(".c-file-txt").val("");
    
    fileHtml += "<label>";
    fileHtml += "    <input type='file' id='" + fileId + "' name='" + fileName + "'>파일선택";
    fileHtml += "</label>";
    
    $(fileObj).append(fileHtml);
    
    //파일 업로드시 파일명 추출 및 파일삭제 버튼 추가
    $(".c-file-input input[type='file']").on("change", function(e) {
        var fileObj = $(this).closest(".c-file-input");
        var fileName = "";
        var fileHtml = "";
        
        $(fileObj).find("label").css("display","inline-block");
        $(fileObj).find(".c-file-btn").remove();
        
        if ($(this).val() != "") {
            if (window.FileReader) {
                //기본 브라우저
                fileName = $(this)[0].files[0].name;
            } else {
                //old IE
                fileName = $(this).val().split('/').pop().split('\\').pop();
            }
            
            fileHtml += "<button type='button' class='c-file-btn' onclick='delFile(this);'>";
            fileHtml += "    <span>파일삭제</span>";
            fileHtml += "</button>";
            
            $(fileObj).find("label").css("display","none");
            $(fileObj).append(fileHtml);
        }
        
        $(fileObj).find(".c-file-txt").val(fileName);
    });
}
//20230213 수정부분 end

//탭 클릭시 해당 탭 내용 보이기
function setTabItem(obj) {
    var dateTabType = $(obj).attr("data-tab-type");
    var dateTabName = $(obj).attr("data-tab-name");
    
    $(obj).parent(".c-tab-list").children("li").removeClass("on");
    $(obj).addClass("on");
    $(".c-tab-item[data-tab-type='" + dateTabType + "']").removeClass("on");
    $(".c-tab-item[data-tab-type='" + dateTabType + "'][data-tab-name='" + dateTabName + "']").addClass("on");
}

//통계관리 일자 검색조건 선택하기
function setStatsDate(obj) {
    var statsDateVal = $(obj).val();
    var statsDateObj = $(obj).closest(".stats-date-area");
    
    $(statsDateObj).find(".stats-date-item").removeClass("on");
    $(statsDateObj).find(".stats-date-" + statsDateVal).addClass("on");
}

//20230210 수정부분 start
//통계관리 차트 그리기
function setStatsChart() {
    if ($(".stats-chart-area").length > 0) {
        //차트 초기화
        if ($("#statsChart").length > 0) {
            $("#statsChart").remove();
        }
        
        //차트 데이터 설정
        var statsTypeVal = $(".stats-type-select").val();
        var statsIdx = 0;
        var statsData = {};
        var chartData = {};
        var chartDatasets = {};
        var chartBackground = [];
        var chartBorder = [];
        var chartValue = [];
        
        chartData.labels = [];
        chartData.datasets = [];
        
        if (statsTypeVal == "신고방식") {
            statsData['ARS'] = 40;
            statsData['문자'] = 10;
        } else if (statsTypeVal == "사유") {
            statsData['긴급연락'] = 1;
            statsData['사고발생'] = 5;
            statsData['차량이동'] = 1;
        } else if (statsTypeVal == "신고발생 건수") {
            statsData['2022-02-21'] = 40;
            statsData['2023-01-06'] = 5;
            statsData['2023-01-16'] = 10;
            statsData['2023-01-17'] = 5;
        }
        
        $.each(statsData, function(key,value) {
            chartBackground.push(chartBackgroundColor[statsIdx % 7]);
            chartBorder.push(chartBorderColor[statsIdx % 7]);
            chartValue.push(value);
            
            chartData.labels.push(key);
            
            statsIdx++;
        });
        
        chartDatasets.label = statsTypeVal;
        chartDatasets.backgroundColor = chartBackground;
        chartDatasets.borderColor = chartBorder;
        chartDatasets.borderWidth = 1;
        chartDatasets.data = chartValue;
        
        chartData.datasets.push(chartDatasets);
        
        //차트 그리기
        $(".stats-chart-area").append("<canvas id='statsChart' width='100' height='50'></canvas>");
        
        statsCtx = document.getElementById('statsChart').getContext('2d');
        statsChart = new Chart(statsCtx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        },
                        afterDataLimits: (scale) => {
                            scale.max = scale.max * 1.2;
                        }
                    }
                }
            }
        });
    }
}
//20230210 수정부분 end

//20230213 수정부분 start
//입력폼 유효성 체크하기
function chkFormValid(obj) {
    var formObj = $(obj).closest(".valid-form-area");
    var formConObj = $(obj).next(".valid-form-con");
    var okFlag = true;
    
    $(formConObj).find("input,select,textarea").each(function() {
        var formTag = $(this).prop("tagName").toLowerCase();
        var formType = $(this).attr("type");
        var formId = $(this).attr("id");
        var formName = $(this).attr("name");
        var formVal = "";
        
        if ($(this).prop("disabled") !== true) {
            //입력값 가져오기
            if (formTag == "input") {
                switch (formType) {
                    case "text" : 
                    case "password" : 
                    case "email" : 
                    case "tel" : 
                    case "number" : 
                    case "file" : 
                    case "hidden" :
                        formVal = $(this).val();
                        break;
                    case "checkbox" : 
                    case "radio" : 
                        if (formName != undefined && formName != "") {
                            formVal = $(formObj).find("input[type='" + formType + "'][name='" + formName + "']:checked").val();
                        }
                        break;
                    default : 
                        formVal = "";
                        break;

                }
            } else if (formTag == "select") {
                formVal = $(this).children("option:selected").val();
            } else if (formTag == "textarea") {
                formVal = $(this).val();
            }
            
            //조건 체크하기
            if ($(this).attr("data-event-flag") == "Y") {
                //data-event-flag : 버튼을 눌러서 유효성을 체크할 경우, data-old-val : 기존의 값으로 data-event-flag가 Y일 경우 사용됨
                if ($(this).attr("data-old-val") != undefined && $(this).attr("data-old-val") != "") {
                    if (formVal != $(this).attr("data-old-val")) {
                        okFlag = false;
                    }
                } else {
                    okFlag = false;
                }
            } else if ($(this).attr("data-compare-id") != undefined && $(this).attr("data-compare-id") != "") {
                //data-compare-id : 해당 id를 가진 항목과 값이 같은지 여부를 비교할 경우
                var compareVal = $(formObj).find("#" + $(this).attr("data-compare-id")).val();
                
                if (compareVal != undefined && compareVal != "") {
                    if (formVal != compareVal) {
                        okFlag = false;
                    }
                } else {
                    okFlag = false;
                }
            } else if ($(this).prop("required") !== false) {
                //required : 필수값일 경우
                if (formVal == undefined || formVal == "") {
                    okFlag = false;
                }
            }
            
            //정규식 체크하기
            if ((formType == "password" && !chkpwExp.test(formVal)) || (formType == "email" && !chkEmailExp.test(formVal)) || (formType == "tel" && !chkNumberExp.test(formVal)) || (formType == "number" && !chkNumberExp.test(formVal))) {
                okFlag = false;
            }
            
            //해당 항목이 비교대상일 경우 체크하기
            if ($(formObj).find("*[data-compare-id='" + formId + "']").length > 0) {
                var compareObj = $(formObj).find("*[data-compare-id='" + formId + "']");
                var compareVal = $(compareObj).val();
                
                if (compareVal != undefined && compareVal != "" && formVal == compareVal && okFlag) {
                    $(compareObj).closest(".valid-form-con").prev(".valid-form-tit").addClass("ok");
                } else {
                    $(compareObj).closest(".valid-form-con").prev(".valid-form-tit").removeClass("ok");
                }
            }
        }
    });
    
    if (okFlag) {
        $(obj).addClass("ok");
    } else {
        $(obj).removeClass("ok");
    }
    
    return false;
}

//입력폼 유효성 체크 결과 확인하기
function chkFormValidResult(obj,page) {
    var formObj = $(obj).closest(".valid-form-area");
    
    if ($(formObj).find(".valid-form-tit").not(".valid-form-tit.ok").length > 0) {
        openLayer("alert","유효하지 않은 항목이 있습니다.<br>다시 확인해주세요.","");
    } else {
        if (page != "") {
            location.href = page;
        } else {
            location.reload();
        }
    }
    
    return false;
}
//20230213 수정부분 end

//20230220 수정부분 start
//코드 하위 항목 추가
function addCodeItem(obj) {
    var tableObj = $(obj).closest(".list-code-area").find(".list-table-area");
    
    if ($(tableObj).length > 0) {
        var tbodyObj = $(tableObj).find(".list-table").children("tbody");
        var trNum = $(tbodyObj).children("tr").length;
        var trHtml = "";
        
        trHtml += "<tr>";
        trHtml += "    <td class='num'>" + (trNum + 1) + "</td>";
        trHtml += "    <td>";
        trHtml += "        <input type='text' id='' name=''>";
        trHtml += "    </td>";
        trHtml += "    <td>";
        trHtml += "        <button type='button' class='default-btn03 small-btn' onclick='delCodeItem(this);'>";
        trHtml += "            <span>삭 제</span>";
        trHtml += "        </button>";
        trHtml += "    </td>";
        trHtml += "</tr>";
        
        $(tbodyObj).append(trHtml);
    }
}

//코드 하위 항목 삭제
function delCodeItem(obj) {
    var tableObj = $(obj).closest(".list-code-area").find(".list-table-area");
    
    if ($(tableObj).length > 0) {
        var tbodyObj = $(tableObj).find(".list-table").children("tbody");
        var trNum = 0;
        
        $(obj).closest("tr").remove();
        
        $(tbodyObj).find("tr").each(function() {
            trNum++;
            $(this).children("td.num").text(trNum);
        });
    }
}

//공지사항에서 공지기간 활성화여부 설정
function setNoticePeriod(obj) {
    var areaObj = $(obj).closest(".notice-period-area");
    
    if ($(obj).is(":checked")) {
        $(areaObj).find("input[type='text']").prop("disabled",true);
    } else {
        $(areaObj).find("input[type='text']").prop("disabled",false);
    }
}
//20230220 수정부분 end

//20230223 수정부분 start
//맵에서 지도 확대하기
function setMapZoomIn(obj) {
    var zoomRangeObj = $(obj).closest(".map-zoom-area").find(".map-zoom-bar").find(".map-zoom-range").find("input[type='range']");
    
    if ($(zoomRangeObj).length > 0) {
        var zoomRangeVal = parseInt($(zoomRangeObj).val());
        
        if (zoomRangeVal < 9) {
            $(zoomRangeObj).val(zoomRangeVal + 1);
        }
    }
}

//맵에서 지도 축소하기
function setMapZoomOut(obj) {
    var zoomRangeObj = $(obj).closest(".map-zoom-area").find(".map-zoom-bar").find(".map-zoom-range").find("input[type='range']");
    
    if ($(zoomRangeObj).length > 0) {
        var zoomRangeVal = parseInt($(zoomRangeObj).val());
        
        if (zoomRangeVal > 1) {
            $(zoomRangeObj).val(zoomRangeVal - 1);
        }
    }
}
//20230223 수정부분 end

//레이어창 열기
function openLayer(type, msg, fun) {
    $("#" + type + "-layer .l-box .l-con-area .l-con").html(msg);
    
    $("#" + type + "-layer .l-box .l-btn-area .confirm-btn").removeAttr("onclick");
    $("#" + type + "-layer .l-box .l-btn-area .confirm-btn").attr("onclick","closeLayer(this);" + fun);
    
    $("#" + type + "-layer").addClass("on");
    
    //20230210 수정부분 start
    $("#" + type + "-layer").stop(true,true).slideDown(300);
    //20230210 수정부분 end
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//20230210 수정부분 start
//내정보 수정창 열기
function openMyinfoLayer(obj) {
    $("#myinfo-layer").addClass("on");
    $("#myinfo-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//관리자계정 등록창 열기
function openAdminInsertLayer(obj) {
    $("#admin-insert-layer").addClass("on");
    $("#admin-insert-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//관리자계정 수정창 열기
function openAdminUpdateLayer(obj) {
    $("#admin-update-layer").addClass("on");
    $("#admin-update-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//사용자계정 상세보기창 열기
function openUserDetailLayer(obj) {
    $("#user-detail-layer").addClass("on");
    $("#user-detail-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//안심번호 생성창 열기
function openSafenumberInsertLayer(obj) {
    $("#safenumber-insert-layer").addClass("on");
    $("#safenumber-insert-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//업체 상세보기창 열기
function openBusinessDetailLayer(obj) {
    $("#business-detail-layer").addClass("on");
    $("#business-detail-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}
//20230210 수정부분 end

//20230213 수정부분 start
//QR코드 보기창 열기
function openQrcodeViewLayer(obj) {
    $("#qrcode-view-layer").addClass("on");
    $("#qrcode-view-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//QR코드 템플릿 파일보기창 열기
function openTemplateViewLayer(obj) {
    $("#template-view-layer").addClass("on");
    $("#template-view-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}
//20230213 수정부분 end

//20230220 수정부분 start
//사용자계정 등록차량창 열기
function openUserCarLayer(obj) {
    $("#user-car-layer").addClass("on");
    $("#user-car-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//권한 등록창 열기
function openAuthInsertLayer(obj) {
    $("#auth-insert-layer").addClass("on");
    $("#auth-insert-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//권한 수정창 열기
function openAuthUpdateLayer(obj) {
    $("#auth-update-layer").addClass("on");
    $("#auth-update-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//코드 등록창 열기
function openCodeInsertLayer(obj) {
    $("#code-insert-layer").addClass("on");
    $("#code-insert-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//코드 수정창 열기
function openCodeUpdateLayer(obj) {
    $("#code-update-layer").addClass("on");
    $("#code-update-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//업체 등록차량창 열기
function openBusinessCarLayer(obj) {
    $("#business-car-layer").addClass("on");
    $("#business-car-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}
//20230220 수정부분 end

//레이어창 닫기
function closeLayer(obj) {
    $(obj).closest(".l-area").removeClass("on");
    
    //20230210 수정부분 start
    $(obj).closest(".l-area").stop(true,true).slideUp(300);
    //20230210 수정부분 end
    
    if ($(".l-wrap.on").length == 0) {
        $("body").removeClass("scroll-disable").off('scroll touchmove');

        var scrollTop = Math.abs(parseInt($("body").css("top")));

        $("html,body").animate({scrollTop: scrollTop}, 0);
    }
}

//20230221 수정부분 start
//맵에서 레이어창 열기
function openMapLayer(obj,type,type2) {
    var mapLayerTit = "";
    var mapLayerHtml = "";
    
    if (type == "print") {
        //지도출력일 경우
        mapLayerTit = "지도출력";
        
        mapLayerHtml = `<div class="detail-table-area">
            <table class="detail-table">
                <colgroup>
                    <col width="100">
                    <col width="*">
                </colgroup>
                <tbody>
                    <tr>
                        <th>사이즈</th>
                        <td>
                            <select id="" name="">
                                <option value="A0">A0</option>
                                <option value="A1">A1</option>
                                <option value="A2">A2</option>
                                <option value="A3">A3</option>
                                <option value="A4" selected>A4</option>
                                <option value="A5">A5</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>해상도</th>
                        <td>
                            <select id="" name="">
                                <option value="72dpi">72dpi</option>
                                <option value="150dpi">150dpi</option>
                                <option value="200dpi" selected>200dpi</option>
                                <option value="300dpi">300dpi</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="detail-bottom-area">
            <button type="button" class="default-btn01 small-btn" onclick="">
                <span>PDF 다운로드</span>
            </button>
        </div>`;
    } else if (type == "measure") {
        //거리재기일 경우
        mapLayerTit = "거리재기";
        
        mapLayerHtml = `<div class="detail-table-area">
            <table class="detail-table">
                <colgroup>
                    <col width="100">
                    <col width="*">
                </colgroup>
                <tbody>
                    <tr>
                        <th>거리재기</th>
                        <td>
                            <select id="" name="">
                                <option value="">선택</option>
                                <option value="선">선</option>
                                <option value="면">면</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    } else if (type == "figure") {
        //도형그리기일 경우
        mapLayerTit = "도형그리기";
        
        mapLayerHtml = `<div class="detail-table-area">
            <table class="detail-table">
                <colgroup>
                    <col width="100">
                    <col width="*">
                </colgroup>
                <tbody>
                    <tr>
                        <th>도형그리기</th>
                        <td>
                            <select id="" name="">
                                <option value="">선택</option>
                                <option value="원">원</option>
                                <option value="정사각형">정사각형</option>
                                <option value="박스">박스</option>
                                <option value="별">별</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    } else if (type == "coordinate") {
        //좌표설정일 경우
        mapLayerTit = "좌표설정";
        
        mapLayerHtml = `<div class="detail-table-area">
            <table class="detail-table">
                <colgroup>
                    <col width="100">
                    <col width="*">
                </colgroup>
                <tbody>
                    <tr>
                        <th>위도</th>
                        <td>
                            <input type="number" id="" name="">
                        </td>
                    </tr>
                    <tr>
                        <th>경도</th>
                        <td>
                            <input type="number" id="" name="">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="detail-bottom-area">
            <button type="button" class="default-btn01 small-btn" onclick="">
                <span>확 인</span>
            </button>
        </div>`;
    } else if (type == "background") {
        //배경지도일 경우
        mapLayerTit = "배경지도";
        
        mapLayerHtml = `<ul class="map-background-list">
            <li>
                <a href="#">
                    <div class="map-background-img" style="background-image: url('../img/map-img.png');"></div>
                    <div class="map-background-txt">배경지도1</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <div class="map-background-img" style="background-image: url('../img/map-img.png');"></div>
                    <div class="map-background-txt">배경지도2</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <div class="map-background-img" style="background-image: url('../img/map-img.png');"></div>
                    <div class="map-background-txt">배경지도3</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <div class="map-background-img" style="background-image: url('../img/map-img.png');"></div>
                    <div class="map-background-txt">배경지도4</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <div class="map-background-img" style="background-image: url('../img/map-img.png');"></div>
                    <div class="map-background-txt">배경지도5</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <div class="map-background-img" style="background-image: url('../img/map-img.png');"></div>
                    <div class="map-background-txt">배경지도6</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <div class="map-background-img" style="background-image: url('../img/map-img.png');"></div>
                    <div class="map-background-txt">배경지도7</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <div class="map-background-img" style="background-image: url('../img/map-img.png');"></div>
                    <div class="map-background-txt">배경지도8</div>
                </a>
            </li>
            <li>
                <a href="#">
                    <div class="map-background-img" style="background-image: url('../img/map-img.png');"></div>
                    <div class="map-background-txt">배경지도9</div>
                </a>
            </li>
        </ul>`;
    } else if (type == "menu") {
        //왼쪽 메뉴일 경우
        if (type2 == "layer") {
            //레이어 메뉴일 경우
            mapLayerTit = "레이어";

            mapLayerHtml = `<ul class="map-layer-list">
                <li>
                    <div class="c-checkbox">
                        <input type="checkbox" id="map-layer-1" name="">
                        <label for="map-layer-1">
                            <span class="marker shape-circle bg-ffa60f"></span>
                            <span class="tit">민원정보</span>
                        </label>
                    </div>
                </li>
                <li>
                    <div class="c-checkbox">
                        <input type="checkbox" id="map-layer-2" name="">
                        <label for="map-layer-2">
                            <span class="marker shape-circle bg-5364be"></span>
                            <span class="tit">위치정보</span>
                        </label>
                    </div>
                </li>
            </ul>`;
        } else if (type2 == "convert") {
            //좌표변환 메뉴일 경우
            mapLayerTit = "좌표변환";

            mapLayerHtml = `<ul class="map-convert-list">
                <li>
                    <div class="tit">입력좌표</div>
                    <div class="con">
                        <select id="" name="">
                            <option value="">선택</option>
                        </select>
                    </div>
                </li>
                <li>
                    <div class="tit">출력좌표</div>
                    <div class="con">
                        <select id="" name="">
                            <option value="">선택</option>
                        </select>
                    </div>
                </li>
                <li>
                    <div class="tit">X좌표 (또는 경도)</div>
                    <div class="con">
                        <input type="number" id="" name="">
                    </div>
                </li>
                <li>
                    <div class="tit">Y좌표 (또는 위도)</div>
                    <div class="con">
                        <input type="number" id="" name="">
                    </div>
                </li>
            </ul>
            <div class="detail-bottom-area">
                <button type="button" class="default-btn01 small-btn" onclick="">
                    <span>좌표변환</span>
                </button>
            </div>
            <ul class="map-convert-list">
                <li>
                    <div class="tit">출력좌표</div>
                    <div class="con">
                        <select id="" name="">
                            <option value="">선택</option>
                        </select>
                    </div>
                </li>
                <li>
                    <div class="tit">X좌표 (또는 경도)</div>
                    <div class="con">
                        <input type="number" id="" name="">
                    </div>
                </li>
                <li>
                    <div class="tit">Y좌표 (또는 위도)</div>
                    <div class="con">
                        <input type="number" id="" name="">
                    </div>
                </li>
            </ul>
            <div class="detail-bottom-area">
                <button type="button" class="default-btn02 small-btn" onclick="">
                    <span>이 동</span>
                </button>
            </div>`;
        } else if (type2 == "report") {
            //리포트 메뉴일 경우
            mapLayerTit = "리포트";

            mapLayerHtml = `<form id="" name="" method="" action="">
                <div class="list-search-area">
                    <div class="search-table-area">
                        <table class="search-table">
                            <colgroup>
                                <col width="*">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="text" id="" name="" placeholder="리포트명을 입력하세요">
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="search-btn-area">
                        <button type="button" class="search-btn" onclick="">
                            <span>검색</span>
                        </button>
                    </div>
                </div>
            </form>
            <div class="list-table-area">
                <table class="list-table">
                    <colgroup>
                        <col width="*">
                        <col width="100">
                    </colgroup>
                    <thead>
                        <tr>
                            <th>리포트명</th>
                            <th>다운로드</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>리포트5</td>
                            <td>
                                <button type="button" class="default-btn04 small-btn download-btn" onclick="">
                                    <span>다운로드</span>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>리포트4</td>
                            <td>
                                <button type="button" class="default-btn04 small-btn download-btn" onclick="">
                                    <span>다운로드</span>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>리포트3</td>
                            <td>
                                <button type="button" class="default-btn04 small-btn download-btn" onclick="">
                                    <span>다운로드</span>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>리포트2</td>
                            <td>
                                <button type="button" class="default-btn04 small-btn download-btn" onclick="">
                                    <span>다운로드</span>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>리포트1</td>
                            <td>
                                <button type="button" class="default-btn04 small-btn download-btn" onclick="">
                                    <span>다운로드</span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="list-paging-area">
                <ul class="list-paging">
                    <li class="arrow first-arrow disabled">
                        <a href="#"></a>
                    </li>
                    <li class="arrow prev-arrow disabled">
                        <a href="#"></a>
                    </li>
                    <li class="on">
                        <a href="#">1</a>
                    </li>
                    <li>
                        <a href="#">2</a>
                    </li>
                    <li>
                        <a href="#">3</a>
                    </li>
                    <li>
                        <a href="#">4</a>
                    </li>
                    <li>
                        <a href="#">5</a>
                    </li>
                    <li class="arrow next-arrow">
                        <a href="#"></a>
                    </li>
                    <li class="arrow last-arrow disabled">
                        <a href="#"></a>
                    </li>
                </ul>
            </div>`;
        }
    }
    
    var maxIndex = 9;
    $(".map-layer.on").each(function() {
        if (parseInt($(this).attr("data-max-index")) >= maxIndex) {
            maxIndex = parseInt($(this).attr("data-max-index")) + 1;
        }
    });
    
    $(".map-" + type + "-layer").css({top:"", left:""});
    $(".map-" + type + "-layer").css("z-index", maxIndex);
    $(".map-" + type + "-layer").attr("data-max-index", maxIndex);
    
    if (type == "menu") {
        $(".c-map .map-left-menu-area .map-menu-list>li>a").removeClass("on");
        $(".c-map .map-left-menu-area .map-menu-list>li>a.map-" + type2 + "-menu").addClass("on");
    }
    
    $(".map-" + type + "-layer .map-layer-tit-area .map-layer-tit").html(mapLayerTit);
    $(".map-" + type + "-layer .map-layer-con-area").html(mapLayerHtml);
    $(".map-" + type + "-layer").addClass("on");
}

//맵에서 레이어창 닫기
function closeMapLayer(obj) {
    if ($(obj).closest(".map-menu-layer").length > 0) {
        $(".c-map .map-left-menu-area .map-menu-list>li>a").removeClass("on");
        $(obj).closest(".map-menu-layer").find(".map-layer-tit-area").find(".map-layer-tit").html("");
    }
    
    $(obj).closest(".map-layer").find(".map-layer-con-area").html("");
    $(obj).closest(".map-layer").removeClass("on");
}
//20230221 수정부분 end


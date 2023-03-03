//정규식 체크
const chkIdExp = RegExp(/^[A-Za-z0-9_\-]{6,12}$/);
const chkpwExp = RegExp(/^[A-Za-z0-9_\-]{8,20}$/);
const chkEmailExp = RegExp(/^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i);
const chkPhoneExp = RegExp(/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/);

//20230303 수정부분 start
const chkCorporateExp = RegExp(/^[0-9]{3}-?[0-9]{2}-?[0-9]{5}$/);
//20230303 수정부분 end

const chkNumberExp = RegExp(/^[0-9-]*$/);

$(function() {
    var userAgent = navigator.userAgent.toLowerCase();
    
    //mobile일 경우
    if ($(".wrap.mobileWrap").length > 0) {
        //ios(아이폰, 아이패드, 아이팟) 전용 css 적용
        if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipad") > -1 || userAgent.indexOf("ipod") > -1) {
            var cssIosLink = document.createElement("link");

            cssIosLink.href = "../css/member-mobile-ios.css";
            cssIosLink.async = false;
            cssIosLink.rel = "stylesheet";
            cssIosLink.type = "text/css";

            document.head.appendChild(cssIosLink);
        }
    }
    
    //리사이즈
    $(window).resize(function() {
        //20230303 수정부분 start
        //모바일에서 100vh 오류 해결방법
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        //20230303 수정부분 end
    });
    
    //스크롤시
    $(window).scroll(function() {
        //pc일 경우
        if ($(".wrap.mobileWrap").length == 0) {
            //헤더 가로 스크롤되도록 설정
            $("header.header").css("left", 0 - $(this).scrollLeft());

            //메뉴바 가로 스크롤되도록 설정
            $("aside.aside").css("left", 0 - $(this).scrollLeft());
        }
    });
    
    //20230303 수정부분 start
    //모바일에서 100vh 오류 해결방법
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    //20230303 수정부분 end
    
    //숫자만 입력
    $("input[type='tel']").on("keyup", function(e) {
         $(this).val($(this).val().replace(/[^0-9-]/g,""));
    });
    
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
    
    //pc일 경우
    if ($(".wrap.mobileWrap").length == 0) {
        //메뉴바 각 메뉴에 텍스트 출력하기
        $("aside.aside .a-menu-list>li .a-sub-menu-list").each(function() {
            var menuTit = $(this).children("li.active").text();
            
            if (menuTit != undefined && menuTit != "") {
                $(this).next(".a-menu-tit").text(menuTit);
            }
        });
        
        //메뉴바 대메뉴의 하위메뉴 보이기&숨기기
        $("aside.aside .a-menu-list>li .a-menu-tit").on("click", function(e) {
            e.preventDefault();
            
            var listObj = $(this).prev(".a-sub-menu-list");
            
            if ($(listObj).hasClass("on")) {
                $(listObj).removeClass("on");
                $(listObj).stop(true,true).slideUp(200);
            } else {
                $(listObj).addClass("on");
                $(listObj).stop(true,true).slideDown(200);
            }
        });
    }
    
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
    
    //FAQ 질문 클릭시 답변 보이기&숨기기
    $(".list-faq-list>li .list-faq-question").on("click", function(e) {
        e.preventDefault();
        
        var liObj = $(this).closest("li");
        
        if ($(liObj).hasClass("on")) {
            $(liObj).removeClass("on");
            $(liObj).find(".list-faq-answer").stop(true,true).slideUp(200);
        } else {
            $(liObj).addClass("on");
            $(liObj).find(".list-faq-answer").stop(true,true).slideDown(200);
        }
    });
    
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
    
    //로딩시 회원정보에서 비밀번호 변경 항목 숨기기
    if ($(".password-change-area").length > 0) {
        var formObj = $(".password-change-area").closest(".valid-form-area");
        
        setPasswordChange($(formObj).find("#password-change"));
    }
    
    //로딩시 회원탈퇴에서 탈퇴사유 입력 항목 숨기기
    if ($(".leave-reason-area").length > 0) {
        var formObj = $(".leave-reason-area").closest(".valid-form-area");
        
        setLeaveReason($(formObj).find("#leave-reason"));
    }
    
    //datepicker 설정
    $(".date-input").each(function() {
        $(this).datepicker();
        
        //20230223 수정부분 start
        if ($(".wrap.mobileWrap").length > 0 && $(".ui-widget-mask").length == 0) {
            $("body").append("<div class='ui-widget-mask'></div>");
        }
        //20230223 수정부분 end
    });
    
    //datepicker 설정
    $(".start-date-input").each(function() {
        $(this).datepicker({
            onSelect: function(selectedDate) {
                $(this).siblings(".end-date-input").datepicker("option","minDate",selectedDate);
            }
        });
        
        //20230223 수정부분 start
        if ($(".wrap.mobileWrap").length > 0 && $(".ui-widget-mask").length == 0) {
            $("body").append("<div class='ui-widget-mask'></div>");
        }
        //20230223 수정부분 end
    });
    
    //datepicker 설정
    $(".end-date-input").each(function() {
        $(this).datepicker({
            onSelect: function(selectedDate) {
                $(this).siblings(".start-date-input").datepicker("option","maxDate",selectedDate);
            }
        });
        
        //20230223 수정부분 start
        if ($(".wrap.mobileWrap").length > 0 && $(".ui-widget-mask").length == 0) {
            $("body").append("<div class='ui-widget-mask'></div>");
        }
        //20230223 수정부분 end
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
    
    //yearpicker 설정
    $(".year-input").each(function() {
        $(this).yearpicker();
    });
});

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

//탭 클릭시 해당 탭 내용 보이기
function setTabItem(obj) {
    var dateTabType = $(obj).attr("data-tab-type");
    var dateTabName = $(obj).attr("data-tab-name");
    
    $(obj).parent(".c-tab-list").children("li").removeClass("on");
    $(obj).addClass("on");
    $(".c-tab-item[data-tab-type='" + dateTabType + "']").removeClass("on");
    $(".c-tab-item[data-tab-type='" + dateTabType + "'][data-tab-name='" + dateTabName + "']").addClass("on");
}

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

//이메일 중복확인시
function chkEmailValid(obj) {
    var formTitObj = $(obj).closest(".valid-form-con").prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    
    if (formVal != undefined && formVal != "" && chkEmailExp.test(formVal)) {
        //유효할 경우
        $(formTitObj).addClass("ok");
    } else {
        //유효하지 않을 경우
        $(formTitObj).removeClass("ok");
    }
}

//연락처 인증요청시
function chkPhoneValid(obj) {
    var formConObj = $(obj).closest(".valid-form-con");
    var formTitObj = $(formConObj).prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    var formHtml = "";
    
    $(formTitObj).removeClass("ok");
    $(formConObj).find(".certify-valid-input").remove();
    
    if (formVal != undefined && formVal != "" && chkPhoneExp.test(formVal)) {
        //유효할 경우
        //certify-valid-input : 인증번호 입력폼
        formHtml += "<div class='c-inline-input certify-valid-input'>";
        formHtml += "    <input type='text' id='' name='' required placeholder='인증번호 입력' data-event-flag='Y'>";
        
        //20230223 수정부분 start
        if ($(".wrap.mobileWrap").length > 0) {
            //mobile일 경우
            formHtml += "    <button type='button' class='default-btn01' onclick='chkCertifyValid(this);'>";
        } else {
            //pc일 경우
            formHtml += "    <button type='button' class='default-btn07 round-btn' onclick='chkCertifyValid(this);'>";
        }
        //20230223 수정부분 end
        
        formHtml += "        <span>인증완료</span>";
        formHtml += "    </button>";
        formHtml += "</div>";
        
        $(formConObj).append(formHtml);
    }
    
    //입력시 입력폼 유효성 체크하기
    $(".valid-form-area .valid-form-con input,.valid-form-area .valid-form-con select,.valid-form-area .valid-form-con textarea").on("propertychange change keyup paste input", function() {
        var formTitObj = $(this).closest(".valid-form-con").prev(".valid-form-tit");
        
        if ($(formTitObj).length > 0) {
            chkFormValid(formTitObj);
        }
    });
}

//연락처 인증번호 인증완료시
function chkCertifyValid(obj) {
    var formTitObj = $(obj).closest(".valid-form-con").prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    
    if (formVal != undefined && formVal != "") {
        //유효할 경우
        $(formTitObj).addClass("ok");
    } else {
        //유효하지 않을 경우
        $(formTitObj).removeClass("ok");
    }
}

//사업자등록번호 중복확인시
function chkCorporateValid(obj) {
    var formTitObj = $(obj).closest(".valid-form-con").prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    
    if (formVal != undefined && formVal != "" && chkCorporateExp.test(formVal)) {
        //유효할 경우
        $(formTitObj).addClass("ok");
    } else {
        //유효하지 않을 경우
        $(formTitObj).removeClass("ok");
    }
}

//차량번호 조회하기시
function chkCarnumberValid(obj) {
    var formTitObj = $(obj).closest(".valid-form-con").prev(".valid-form-tit");
    var formVal = $(obj).prev("input").val();
    
    if (formVal != undefined && formVal != "") {
        //유효할 경우
        $(formTitObj).addClass("ok");
    } else {
        //유효하지 않을 경우
        $(formTitObj).removeClass("ok");
    }
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

//회원정보에서 비밀번호 변경 항목 보이기&숨기기
function setPasswordChange(obj) {
    var formObj = $(obj).closest(".valid-form-area");
    
    if ($(obj).is(":checked")) {
        //20230223 수정부분 start
        if ($(".wrap.mobileWrap").length > 0) {
            //mobile일 경우
            $(formObj).find(".password-change-area").css("display","block");
        } else {
            //pc일 경우
            $(formObj).find(".password-change-area").css("display","table-row");
        }
        //20230223 수정부분 end
        
        $(formObj).find(".password-change-area").find("input").prop("disabled",false);
    } else {
        $(formObj).find(".password-change-area").css("display","none");
        $(formObj).find(".password-change-area").find("input").prop("disabled",true);
        $(formObj).find(".password-change-area").find("input").val("");
    }
    
    $(formObj).find(".password-change-area").find("input").each(function() {
        var formTitObj = $(this).closest(".valid-form-con").prev(".valid-form-tit");
        
        chkFormValid(formTitObj);
    });
}

//회원탈퇴에서 탈퇴사유 입력 항목 보이기&숨기기
function setLeaveReason(obj) {
    var formObj = $(obj).closest(".valid-form-area");
    
    if ($(obj).val() == "직접입력") {
        $(formObj).find(".leave-reason-area").css("display","block");
        $(formObj).find(".leave-reason-area").find("input").prop("disabled",false);
    } else {
        $(formObj).find(".leave-reason-area").css("display","none");
        $(formObj).find(".leave-reason-area").find("input").prop("disabled",true);
        $(formObj).find(".leave-reason-area").find("input").val("");
    }
    
    $(formObj).find(".leave-reason-area").find("input").each(function() {
        var formTitObj = $(this).closest(".valid-form-con").prev(".valid-form-tit");
        
        chkFormValid(formTitObj);
    });
}

//20230223 수정부분 start
//모바일 메뉴창 열기
function openMobileMenu(obj) {
    $(".m-wrap").addClass("on");
}

//모바일 메뉴창 닫기
function closeMobileMenu(obj) {
    $(".m-wrap").removeClass("on");
}

//안심번호 연결에서 전송사유 선택시 문자내용 예시 변경하기
function setSendReason(obj) {
    var formObj = $(obj).closest(".valid-form-area");
    var placeholder = "";
    
    if ($(obj).val() == "차량이동") {
        placeholder = "예) 차량이동으로 연락드립니다. 8282";
    } else if ($(obj).val() == "사고발생") {
        placeholder = "예) 접촉사고 때문에 010-1234-5678로 연락해주세요.";
    } else if ($(obj).val() == "긴급연락") {
        placeholder = "예) 010-1234-5678로 연락해주세요.";
    }
    
    $(formObj).find("#send-content").attr("placeholder", placeholder);
}
//20230223 수정부분 end

//레이어창 열기
function openLayer(type, msg, fun) {
    $("#" + type + "-layer .l-box .l-con-area .l-con").html(msg);
    
    $("#" + type + "-layer .l-box .l-btn-area .confirm-btn").removeAttr("onclick");
    $("#" + type + "-layer .l-box .l-btn-area .confirm-btn").attr("onclick","closeLayer(this);" + fun);
    
    $("#" + type + "-layer").addClass("on");
    $("#" + type + "-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

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

//20230223 수정부분 start
//위치정보 제공 약관동의창 열기
function openPositionAgreementLayer(obj) {
    $("#position-agreement-layer").addClass("on");
    $("#position-agreement-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}

//연락처 제공 약관동의창 열기
function openPhoneAgreementLayer(obj) {
    $("#phone-agreement-layer").addClass("on");
    $("#phone-agreement-layer").stop(true,true).slideDown(300);
    
    var scrollTop = parseInt($(document).scrollTop());

    $("body").css("top", -scrollTop + "px");

    $("body").addClass("scroll-disable").on('scroll touchmove', function(event) {
        event.preventDefault();
    });
}
//20230223 수정부분 end

//레이어창 닫기
function closeLayer(obj) {
    $(obj).closest(".l-area").removeClass("on");
    $(obj).closest(".l-area").stop(true,true).slideUp(300);
    
    if ($(".l-wrap.on").length == 0) {
        $("body").removeClass("scroll-disable").off('scroll touchmove');

        var scrollTop = Math.abs(parseInt($("body").css("top")));

        $("html,body").animate({scrollTop: scrollTop}, 0);
    }
}


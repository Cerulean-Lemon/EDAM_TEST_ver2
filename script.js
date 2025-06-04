// --- 인트로, 헤더, 사이드바 등 관련 (주로 paste-2.txt [2] 기반) ---
window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("introOverlay");
  const sloganTextEl = document.querySelector("#introOverlay .slogan-text"); // 변수명 변경 및 선택자 명확화
  const introScrollMouse = document.querySelector(
    "#introOverlay .scroll-mouse"
  );
  let finished = false,
    sloganShown = false,
    sloganTypingDone = false;

  let lastScroll = 0;
  const showSloganAt = 300;
  const outroAt = 600;

  function showSlogan() {
    if (sloganShown) return;
    sloganShown = true;

    const sloganTyping = document.getElementById("sloganTyping"); // #introOverlay 내부의 것
    const edamBlock = document.getElementById("edamBlock");
    const text = "이다음의 세상을 메이드하다";
    sloganTyping.innerHTML = "";
    edamBlock.style.opacity = 0;
    sloganTypingDone = false;

    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.textContent = ch;
      span.style.opacity = 0;
      sloganTyping.appendChild(span);
      gsap.to(span, {
        opacity: 1,
        delay: 0.05 * i,
        duration: 0.08,
        ease: "power1.out",
      });
    });

    gsap.to(edamBlock, {
      opacity: 1,
      delay: 0.1 * text.length + 0.1,
      duration: 0.4,
      ease: "power1.out",
    });

    if (sloganTextEl) {
      // 변수명 변경된 것 사용
      sloganTextEl.style.opacity = 1;
      sloganTextEl.style.filter = "blur(0px)";
    }

    setTimeout(() => {
      sloganTypingDone = true;
    }, (0.1 * text.length + 0.36 + 0.3) * 1000);

    if (introScrollMouse) {
      introScrollMouse.style.transition =
        "opacity 0.7s cubic-bezier(.42,0,.58,1)";
      introScrollMouse.style.opacity = 0;
      setTimeout(() => {
        if (introScrollMouse.parentNode) introScrollMouse.remove();
      }, 800);
    }
  }

  function endIntro() {
    if (finished) return;
    finished = true;

    if (sloganTextEl) {
      // 변수명 변경된 것 사용
      sloganTextEl.style.transition = "opacity 0.5s, filter 0.7s";
      sloganTextEl.style.opacity = 0;
      sloganTextEl.style.filter = "blur(7px)";
    }

    gsap.to(intro, {
      opacity: 0,
      duration: 0.08, // 매우 빠르게 사라짐
      delay: 0.3,
      onComplete: () => {
        if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
        document.body.classList.add("show-main");
        // 메인 콘텐츠 등장 애니메이션 (헤더, 사이드바, #pinContainer, 섹션 등)
        gsap.from(".header, .sidebar, #pinContainer, section, .fixed-box", {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 1, // 지속시간 조정
          ease: "power2.out",
        });
        document.body.style.overflow = "auto";
      },
    });
  }

  if (sloganTextEl) {
    // 초기 상태 설정
    sloganTextEl.style.opacity = 0;
    sloganTextEl.style.filter = "blur(7px)";
  }
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);

  window.addEventListener(
    "wheel",
    (e) => {
      if (finished) return;
      // 스크롤 이벤트 중복 방지 및 부드러운 처리 위해 e.preventDefault() 등 고려 가능
      // passive: false 일 때만 preventDefault 가능
      lastScroll += Math.abs(e.deltaY);

      if (!sloganShown && lastScroll > showSloganAt) {
        showSlogan();
        return;
      }
      if (sloganShown && sloganTypingDone && lastScroll > outroAt) {
        endIntro();
      }
    },
    { passive: true } // 스크롤 성능을 위해 passive: true로 변경, 단 preventDefault 사용 불가
  );

  let touchStart = 0;
  window.addEventListener(
    "touchstart",
    (e) => {
      if (finished) return;
      touchStart = e.touches[0].clientY;
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (finished) return;
      let touchMove = e.touches[0].clientY;
      let diff = Math.abs(touchStart - touchMove);
      lastScroll += diff;
      touchStart = touchMove;

      if (!sloganShown && lastScroll > showSloganAt) {
        showSlogan();
        return;
      }
      if (sloganShown && sloganTypingDone && lastScroll > outroAt) {
        endIntro();
      }
    },
    { passive: true } // 스크롤 성능을 위해 passive: true로 변경
  );

  // --- 헤더 인터랙션 (아티스트 선택, 언어 선택 등) ---
  function keepDropdownOpen(event, target) {
    const related = event.relatedTarget;
    return related && (target.contains(related) || related === target);
  }

  function setupArtistHover(
    container,
    letters,
    arrow,
    gradientColors,
    arrowGradient
  ) {
    if (!container || !arrow) return; // 요소 존재 확인
    container.addEventListener("mouseenter", () => {
      letters.forEach((el, i) => {
        gsap.to(el, {
          color: gradientColors[i % gradientColors.length],
          y: -4,
          duration: 0.2,
          delay: i * 0.03,
          ease: "power1.out",
        });
      });
      gsap.to(arrow, {
        y: -4,
        duration: 0.2,
        delay: letters.length * 0.03,
        ease: "power1.out",
        onStart: () => {
          arrow.style.background = arrowGradient;
          arrow.style.webkitBackgroundClip = "text";
          arrow.style.webkitTextFillColor = "transparent";
        },
      });
    });

    container.addEventListener("mouseleave", () => {
      letters.forEach((el, i) => {
        gsap.to(el, {
          y: 0,
          color: "black",
          duration: 0.2,
          delay: i * 0.02,
          ease: "power1.inOut",
        });
      });
      gsap.to(arrow, {
        y: 0,
        duration: 0.2,
        delay: 0.1,
        ease: "power1.inOut",
        onComplete: () => {
          arrow.style.background = "none";
          arrow.style.webkitTextFillColor = "black";
        },
      });
    });
  }

  function setupDropdownHover(trigger, dropdown, arrow = null) {
    if (!trigger || !dropdown) return; // 요소 존재 확인
    let hideTimeout;
    const displayType = "block"; // dropdown.style.display 값

    trigger.addEventListener("mouseout", (e) => {
      if (!keepDropdownOpen(e, trigger)) {
        hideTimeout = setTimeout(() => {
          dropdown.style.display = "none";
          if (arrow) arrow.textContent = "▼";
        }, 200);
      }
    });

    trigger.addEventListener("mouseover", () => clearTimeout(hideTimeout));
    dropdown.addEventListener("mouseover", () => clearTimeout(hideTimeout));

    dropdown.addEventListener("mouseout", (e) => {
      if (!keepDropdownOpen(e, dropdown)) {
        hideTimeout = setTimeout(() => {
          dropdown.style.display = "none";
          if (arrow) arrow.textContent = "▼";
        }, 200);
      }
    });
  }

  const artistTextContainer = document.getElementById("artistText");
  const gradientLetters = document.querySelectorAll("#gradientText span");
  const artistArrowEl = document.getElementById("artistArrow");
  const artistIconEl = document.getElementById("artistIcon");
  const artistDropdownEl = document.getElementById("artistDropdown");
  const langSelectorEl = document.querySelector(".language-selector");

  if (artistTextContainer && artistArrowEl) {
    // 요소 존재 확인
    const gradientColors = ["#D26D99", "#AAC154", "#2DA5C0", "#315E9E"];
    const arrowGradient = "linear-gradient(90deg, #008AC9, #00FFFF)";
    setupArtistHover(
      artistTextContainer,
      gradientLetters,
      artistArrowEl,
      gradientColors,
      arrowGradient
    );
  }

  if (
    artistTextContainer &&
    artistDropdownEl &&
    artistArrowEl &&
    artistIconEl
  ) {
    // 요소 존재 확인
    let artistDropdownTimeout;
    artistTextContainer.addEventListener("mouseenter", () => {
      clearTimeout(artistDropdownTimeout);
      artistDropdownEl.style.display = "block";
      artistArrowEl.textContent = "arrow_drop_up";
    });
    artistTextContainer.addEventListener("mouseleave", () => {
      artistDropdownTimeout = setTimeout(() => {
        artistDropdownEl.style.display = "none";
        artistArrowEl.textContent = "arrow_drop_down";
      }, 150);
    });
    artistDropdownEl.addEventListener("mouseenter", () => {
      clearTimeout(artistDropdownTimeout);
      artistArrowEl.textContent = "arrow_drop_up";
    });
    artistDropdownEl.addEventListener("mouseleave", () => {
      artistDropdownTimeout = setTimeout(() => {
        artistDropdownEl.style.display = "none";
        artistArrowEl.textContent = "arrow_drop_down";
      }, 150);
    });

    const artistItems = artistDropdownEl.querySelectorAll("li");
    const artistImages = {
      IU: "images/MyArtist_IU.png",
      WOODZ: "images/MyArtist_Woodz.png",
    };
    artistItems.forEach((item) => {
      item.addEventListener("click", () => {
        const selectedArtist = item.dataset.artist;
        artistIconEl.src =
          artistImages[selectedArtist] || "images/question.png"; // 기본 이미지 추가
        localStorage.setItem("selectedArtist", selectedArtist);
        artistDropdownEl.style.display = "none";
        artistArrowEl.textContent = "arrow_drop_down";
      });
    });
    const savedArtist = localStorage.getItem("selectedArtist");
    if (savedArtist && artistImages[savedArtist]) {
      artistIconEl.src = artistImages[savedArtist];
    }
  }

  if (langSelectorEl) {
    // 요소 존재 확인
    const langDropdownEl = langSelectorEl.querySelector(".language-dropdown");
    const langArrowEl = langSelectorEl.querySelector(".arrow");
    const langItems = langDropdownEl.querySelectorAll("li");
    const currentLangTextEl = langSelectorEl.querySelector("#current-lang"); // ID로 정확히 지정

    let langDropdownVisible = false;
    langSelectorEl.addEventListener("click", (e) => {
      e.stopPropagation();
      langDropdownVisible = !langDropdownVisible;
      langDropdownEl.style.display = langDropdownVisible ? "block" : "none";
      if (langArrowEl)
        langArrowEl.textContent = langDropdownVisible ? "▲" : "▼";
    });

    setupDropdownHover(langSelectorEl, langDropdownEl, langArrowEl);

    langItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        langItems.forEach((li) => li.classList.remove("selected"));
        item.classList.add("selected");
        if (currentLangTextEl && langArrowEl) {
          // #current-lang 내부의 .arrow도 업데이트
          currentLangTextEl.innerHTML = `${item.dataset.lang} <span class="arrow">▼</span>`;
        }
        langDropdownEl.style.display = "none";
        if (langArrowEl) langArrowEl.textContent = "▼"; // setupDropdownHover에서 이미 처리할 수 있음
        langDropdownVisible = false;
      });
    });

    document.addEventListener("click", (e) => {
      // 외부 클릭 시 언어 드롭다운 닫기
      if (!langSelectorEl.contains(e.target)) {
        langDropdownEl.style.display = "none";
        if (langArrowEl) langArrowEl.textContent = "▼";
        langDropdownVisible = false;
      }
    });
  }

  // --- 사이드바 스크롤 효과 ---
  const sidebarEl = document.querySelector(".sidebar");
  if (sidebarEl) {
    // 요소 존재 확인
    const baseSidebarOffset = 150; // CSS의 top 값과 유사하게 설정

    function resetSidebarPosition() {
      sidebarEl.style.top = baseSidebarOffset + "px";
      sidebarEl.style.display = "block"; // 인트로 사라진 후 보이도록
    }

    const observer = new MutationObserver(() => {
      if (document.body.classList.contains("show-main")) {
        resetSidebarPosition(); // 초기 위치 설정
        observer.disconnect(); // 한번 실행 후 관찰 중지
      }
    });
    observer.observe(document.body, { attributes: true });

    window.addEventListener("scroll", () => {
      if (!document.body.classList.contains("show-main")) return; // 인트로 중에는 작동 안함
      const scrollTop = window.scrollY;
      const headerHeight =
        document.querySelector(".header")?.offsetHeight || 100; // 헤더 높이 동적 계산
      // 사이드바가 헤더 아래부터 시작하고, 스크롤 시 특정 최소 top 값 유지
      const newTop = Math.max(headerHeight + 20, baseSidebarOffset - scrollTop);

      // GSAP 대신 직접 스타일 변경 (또는 GSAP 사용 유지)
      // sidebarEl.style.top = newTop + "px";
      // 아래는 GSAP 사용 유지
      gsap.to(sidebarEl, {
        duration: 0.4,
        top: Math.max(headerHeight + 20, baseSidebarOffset + scrollTop), // scrollTop을 더하는 형태로 변경해야 따라 내려옴
        // 혹은 CSS에서 position: sticky 사용 고려
        ease: "power2.out",
      });

      const intendedTop = baseSidebarOffset + scrollTop; // 스크롤 따라 내려가는 기본 위치
      const minTopDueToHeader = headerHeight + 20; // 헤더 바로 아래 최소 위치
      gsap.to(sidebarEl, {
        duration: 0.4,
        top: Math.max(minTopDueToHeader, intendedTop), // 헤더 밑으로 내려가지 않으면서 스크롤 따라 이동
        ease: "power2.out",
      });
    });
  }
});

// --- 패널 애니메이션 관련 (첫 번째 HTML의 script.js 기반) ---
$(function () {
  // jQuery DOM ready
  if (!$("#pinContainer").length) return; // #pinContainer 없으면 실행 안함

  var controller = new ScrollMagic.Controller();

  // 패널 전환 애니메이션 (GSAP 3.x 문법)
  var wipeAnimation = gsap
    .timeline()
    .fromTo(".panel2", { x: "-100%" }, { x: "0%", ease: "none", duration: 1 })
    .fromTo(".panel3", { x: "100%" }, { x: "0%", ease: "none", duration: 1 })
    .fromTo(".panel4", { y: "-100%" }, { y: "0%", ease: "none", duration: 1 });

  new ScrollMagic.Scene({
    triggerElement: "#pinContainer",
    triggerHook: "onLeave", // #pinContainer 상단이 뷰포트 상단을 지날 때 시작
    duration: "300%", // 각 패널이 100%씩 스크롤되므로, 3번 전환 시 300%
    // panel이 4개이고, 3번 전환이므로 OK.
  })
    .setPin("#pinContainer")
    .setTween(wipeAnimation)
    // .addIndicators() // 디버깅 시 주석 해제
    .addTo(controller);

  // #pinContainer 내부 스크롤 마우스 아이콘 페이드 아웃 제어
  var $pinContainerMouse = $("#scrollMousePinContainer"); // ID 변경 적용

  // ScrollMagic Scene의 진행 상태에 따라 마우스 아이콘 투명도 조절
  controller.on("update", function () {
    if (!document.body.classList.contains("show-main")) {
      if ($pinContainerMouse.length) $pinContainerMouse.css("opacity", 0); // 인트로 중에는 숨김
      return;
    }
    // 현재 ScrollMagic Scene을 찾거나, progress를 직접 계산해야 함.
    // 여기서는 #pinContainer가 pin된 후의 스크롤 진행에 따라 조절하는 방식으로 변경.
    // 이 부분은 ScrollMagic Scene의 'progress' 이벤트를 사용하는 것이 더 정확합니다.
  });

  // 간단한 윈도우 스크롤 기반 페이드 아웃 (기존 로직 유지하되, #pinContainer 활성화 시점 고려)
  $(window).on("scroll", function () {
    if (
      !document.body.classList.contains("show-main") ||
      !$pinContainerMouse.length
    ) {
      if ($pinContainerMouse.length) $pinContainerMouse.css("opacity", 0);
      return;
    }

    var pinContainerElement = document.getElementById("pinContainer");
    if (!pinContainerElement) return;

    var rect = pinContainerElement.getBoundingClientRect();
    var pinContainerIsPinned =
      rect.top <= 0 && rect.bottom >= window.innerHeight; // 대략적인 pin 상태 체크

    if (pinContainerIsPinned) {
      // #pinContainer가 pin 되어 있을 때, 내부 스크롤(처럼 보이는 효과)에 따라 opacity 조절
      // ScrollMagic Scene의 progress를 사용하는 것이 가장 이상적임
      // 여기서는 #pinContainer 내부 스크롤 진행률을 직접 계산하기 어려우므로
      // #pinContainer가 화면 상단에 도달한 후 일정 스크롤 양에 따라 사라지도록 단순화
      var scrollY = window.scrollY || window.pageYOffset;
      var containerTopOffset = $(pinContainerElement).offset().top;
      var scrollRelativeToContainerStart = scrollY - containerTopOffset;

      var fadeOutStart = window.innerHeight * 0.1; // 핀 된 후 10% 스크롤 시 사라지기 시작
      var fadeOutEnd = window.innerHeight * 0.3; // 핀 된 후 30% 스크롤 시 완전히 사라짐

      if (scrollRelativeToContainerStart < 0) {
        // 아직 컨테이너 상단에 도달 전
        $pinContainerMouse.css("opacity", 1);
      } else if (scrollRelativeToContainerStart < fadeOutStart) {
        $pinContainerMouse.css("opacity", 1);
      } else if (scrollRelativeToContainerStart > fadeOutEnd) {
        $pinContainerMouse.css("opacity", 0);
      } else {
        var t =
          (scrollRelativeToContainerStart - fadeOutStart) /
          (fadeOutEnd - fadeOutStart);
        $pinContainerMouse.css("opacity", 1 - Math.min(1, Math.max(0, t))); // t가 0~1 사이도록 보장
      }
    } else if (rect.top > 0) {
      // #pinContainer가 아직 화면 상단에 도달 전
      $pinContainerMouse.css("opacity", 1);
    } else {
      // #pinContainer가 화면을 지나간 후
      $pinContainerMouse.css("opacity", 0);
    }
  });
});

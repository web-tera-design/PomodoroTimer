// 画面サイズ375px以下はいい感じに縮小
document.addEventListener("DOMContentLoaded", () => {
    function scaleContent() {
        const minWidth = 375;
        if (window.innerWidth < minWidth) {
            const scale = window.innerWidth / minWidth;
            document.body.style.transform = `scale(scale)`;
            document.body.style.transformOrigin = "top left";
            document.body.style.width = `minWidthpx`; // レイアウト維持
        } else {
            document.body.style.transform = ""; // 拡大・縮小を無効化
            document.body.style.width = ""; // デフォルトの幅に戻す
        }
    }
    scaleContent();
    window.addEventListener("resize", scaleContent);
});

// ドロワー
document.addEventListener('DOMContentLoaded', () => {
    const drawer = document.querySelector('.drawer');
    const drawerIcon = document.querySelector('.drawer-icon');
    const body = document.body;
    let isMenuOpen = false;

    if (!drawer || !drawerIcon) return;

    // 初期状態（非表示）
    drawer.style.opacity = '0';
    drawer.style.visibility = 'hidden';
    drawer.style.transform = 'translateY(-100%)'; // 上からスライド
    drawer.style.overflow = 'hidden';
    drawer.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out, visibility 0.3s ease-in-out';

    const openMenu = () => {
      isMenuOpen = true;
      drawer.classList.add('js-show');
      drawerIcon.classList.add('js-show'); // 追加
      drawer.style.opacity = '1';
      drawer.style.visibility = 'visible';
      drawer.style.transform = 'translateY(0)';
      body.style.overflow = 'hidden'; // スクロールを防止
      drawerIcon.setAttribute('aria-expanded', 'true'); // アクセシビリティ対応
    };

    const closeMenu = () => {
      isMenuOpen = false;
      drawer.classList.remove('js-show');
      drawerIcon.classList.remove('js-show'); // 追加
      drawer.style.opacity = '0';
      drawer.style.visibility = 'hidden';
      drawer.style.transform = 'translateY(-100%)';
      body.style.overflow = ''; // スクロール解除
      drawerIcon.setAttribute('aria-expanded', 'false'); // アクセシビリティ対応
    };

    drawerIcon.addEventListener('click', () => {
      if (isMenuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // 画面リサイズ時に開いていたら閉じる
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
      }
    });

    // メニュー外クリックで閉じる
    document.addEventListener('click', (event) => {
      if (!drawer.contains(event.target) && !drawerIcon.contains(event.target) && isMenuOpen) {
        closeMenu();
      }
    });

    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    });

    // ページ内リンククリック時のスクロール処理
    document.querySelectorAll('.drawer__item-link').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        closeMenu();
      });
    });
});


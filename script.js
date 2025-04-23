

	const cursor = document.querySelector('.custom-cursor');
	const hoverTargets = document.querySelectorAll('.hover-target');
	
	document.addEventListener('mousemove', (e) => {
		cursor.style.left = e.clientX + 'px';
		cursor.style.top = e.clientY + 'px';
		
		// デフォルトカーソルを非表示
		// document.body.style.cursor = 'none'; 
		
		// cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
		// cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(1)`
		
	});
	
	
	const targets = document.querySelectorAll('.js-target');
	
	targets.forEach(target => {
		target.addEventListener('mouseover', function() {
			// cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(5)`
			cursor.classList.add('js-hover');
		});
	
	
		target.addEventListener('mouseout', function() {
			cursor.classList.remove('js-hover');
		});
	});
	
	
	// hover したときにカスタムカーソルを表示
	hoverTargets.forEach(hoverTarget => { 
		hoverTarget.addEventListener('mouseenter', () => {
				cursor.classList.add('js-hover');
		  // cursor.style.display = 'block'; // カスタムカーソルを表示
		  // document.body.style.cursor = 'none'; // デフォルトカーソルを非表示
		});
	
		// hover から外れたときにカスタムカーソルを非表示
		hoverTarget.addEventListener('mouseleave', () => {
		  // cursor.style.display = 'none'; // カスタムカーソルを非表示
				cursor.classList.remove('js-hover');
		  // document.body.style.cursor = 'default'; // デフォルトカーソルを再表示
		});
	});
	
	







	// // if (document.body.classList.contains('page-contact')) {

	// 	// メールアドレス検証関数
	// 	function validateEmail(email) {
	// 		const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	// 		return re.test(String(email).toLowerCase());
	// 	}
		
		
	// 	// 全ての入力フィールドとメッセージ要素に対して共通の処理を設定
	// 	document.querySelectorAll('.form-input').forEach(field => {
	// 		// 対応するメッセージ要素を取得

	// 		const messageId = field.id + 'FieldMessage';
	// 		const message = document.getElementById(messageId);

	// 		// const input = field.value.trim();
			



	// 		field.addEventListener('blur', function() {

	// 			// var input = this.value.trim(); // 入力値を取得し、余分な空白を削除
	// 			// var errorSpan = document.getElementById('usernameError'); // エラーメッセージ表示用の要素を取得

	// 			if (field.value.trim() === '') { // 入力が空の場合はエラーを表示
	// 				message.textContent = '入力は必須です。';
	// 				hasError = true;
	// 			} else {
	// 				message.textContent = '';
	// 				hasError = false;
	// 			}
	// 		});

	// 		field.addEventListener('input', function() {
	// 			// const input = field.value.trim();
	// 			if (field.value.trim() !== '') {
	// 				message.textContent = '';
	// 				hasError = false;
	// 				// console.log('入力されました');
	// 			}
	// 		});
	// 	});




	// 	document.getElementById('contactForm').addEventListener('submit', function(event) {
	// 		let hasError = false;
	// 		document.querySelectorAll('.form-input').forEach(field => {
	// 			const messageId = field.id + 'FieldMessage';
	// 			const message = document.getElementById(messageId);

	// 			if (field.value.trim() === '') {
	// 				message.textContent = '入力は必須です。';
	// 				hasError = true;
	// 			} else if (field.type === 'email' && !validateEmail(field.value)) {
	// 				message.textContent = '無効なメールアドレス形式です。';
	// 				hasError = true;
	// 			}
	// 		});

	// 		if (hasError) {
	// 			event.preventDefault();  // エラーがある場合、フォームの送信を防ぐ
	// 		}
	// 	});
	// // }

	document.addEventListener('DOMContentLoaded', function () {
		// メールアドレス検証関数
		function validateEmail(email) {
			const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			return re.test(String(email).toLowerCase());
		}
	
		// フィールドのバリデーション処理
		function validateField(field, showError = true) {
			const messageId = field.id + 'FieldMessage';
			const message = document.getElementById(messageId);
			let isValid = true;
	
			if (!message) return isValid; // メッセージ要素がない場合は何もしない
	
			if (field.value.trim() === '') {
				if (showError) {
					message.textContent = '入力は必須です。';
				}
				isValid = false;
			} else if (field.type === 'email' && !validateEmail(field.value)) {
				if (showError) {
					message.textContent = '無効なメールアドレス形式です。';
				}
				isValid = false;
			} else {
				message.textContent = '';
			}
	
			return isValid;
		}
	
		// すべての入力フィールドにバリデーションを適用
		document.querySelectorAll('.form-input').forEach(field => {
			field.addEventListener('blur', () => validateField(field, true));
			field.addEventListener('input', () => validateField(field, false)); // 入力時にはエラーメッセージを消す
		});
	
		// フォーム送信時のバリデーション
		document.querySelector('.form').addEventListener('submit', function (event) {
			let hasError = false;
			let firstErrorField = null; // 最初のエラーのある入力欄を記録
	
			document.querySelectorAll('.form-input').forEach(field => {
				if (!validateField(field, true)) {
					hasError = true;
					if (!firstErrorField) {
						firstErrorField = field; // 最初のエラーのあるフィールドを記録
					}
				}
			});
	
			if (hasError) {
				event.preventDefault(); // エラーがある場合は送信を防ぐ

				if (firstErrorField) {
					firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' }); // スクロール
					firstErrorField.focus(); // フォーカスを移動
				}
			}
		});
	});
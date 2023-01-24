/*

Supported languages

English - en
Spanish - es
French - fr
Russian - ru
Japanese - ja	
Indonesian - id
Croatian - hr
arabic - ar
*/

export async function pushNotificationMessage(type, requestData, lang) {
	let title = '', message = '', requestLang;
	let supportedLang = ['en', 'es', 'fr', 'ru', 'ja', 'id', 'hr', 'ar'];
	requestLang = lang ? lang : 'en';
	requestLang = (supportedLang.indexOf(requestLang) >= 0) ? requestLang : 'en';

	//  Notifications
	if (type === 'serviceRequest') {
		if (requestLang == 'en') {
			title = 'Ting-Ting! You got a new job request!';
			message = `You got a new job request for ${requestData['subCategoryList']} at ${requestData['userLocation']}! Are you in?`;
		} else if (requestLang == 'es') {
			title = '¡Ting-Ting! ¡Tienes una nueva solicitud de trabajo!';
			message = `Tienes una nueva solicitud de trabajo para ${requestData['subCategoryList']} en ${requestData['userLocation']}! Está usted en?`;
		} else if (requestLang == 'fr') {
			title = "Ting-Ting ! Vous avez une nouvelle demande d'emploi !";
			message = `Vous avez reçu une nouvelle demande d'emploi pour ${requestData['subCategoryList']} à ${requestData['userLocation']}! Es-tu dans?`;
		} else if (requestLang == 'ru') {
			title = 'Тинг-Тин! Вы получили новый запрос на работу!';
			message = `Вы получили новый запрос на работу для ${requestData['subCategoryList']} в	${requestData['userLocation']}! Вы в?`;
		} else if (requestLang == 'ja') {
			title = 'ティンティン！あなたは新しい仕事のリクエストを受け取りました！';
			message = `あなたはのための新しい仕事の要求を受け取りました ${requestData['subCategoryList']} で ${requestData['userLocation']}! あなたは中にいますか?`;
		} else if (requestLang == 'id') {
			title = 'Ting-Ting! Anda mendapat permintaan pekerjaan baru!';
			message = `Anda mendapat permintaan pekerjaan baru untuk ${requestData['subCategoryList']} pada ${requestData['userLocation']}! Kau di?`;
		} else if (requestLang == 'hr') {
			title = 'Ting-Ting! Dobili ste novi zahtjev za posao!';
			message = `Dobili ste novi zahtjev za posao	${requestData['subCategoryList']} na ${requestData['userLocation']}! Jeste li u?`;
		} else if (requestLang == 'ar') {
			title = 'تينج تينج! لقد حصلت على طلب عمل جديد!';
			message = `لقد حصلت على طلب عمل جديد لـ	${requestData['subCategoryList']} في ${requestData['userLocation']}! هل انت معنا?`;
		}
	}

	if (type === 'serviceAccepted') {
		if (requestLang == 'en') {
			title = `Hurray! Your job request #${requestData['bookingId']} accepted!`;
			message = `Your job request #${requestData['bookingId']}  has been accepted by ${requestData['partnerDetails']['name']}  and the service provider is on the way!`;
		} else if (requestLang == 'es') {
			title = `¡Viva! su solicitud de trabajo #${requestData['bookingId']} aceptada! `;
			message = `su solicitud de trabajo #${requestData['bookingId']}  ha sido aceptado por ${requestData['partnerDetails']['name']}  ¡y el proveedor de servicios está en camino!`;
		} else if (requestLang == 'fr') {
			title = `Hourra! Votre demande d'emploi #${requestData['bookingId']} accepté! `;
			message = `Votre demande d'emploi #${requestData['bookingId']}  a été accepté par ${requestData['partnerDetails']['name']}  et le fournisseur de services est en route !`;
		} else if (requestLang == 'ru') {
			title = `Ура! Ваш запрос на работу #${requestData['bookingId']} принятый! `;
			message = `Ваш запрос на работу #${requestData['bookingId']}  был принят ${requestData['partnerDetails']['name']}  и поставщик услуг уже в пути!`;
		} else if (requestLang == 'ja') {
			title = `やあ！あなたの仕事のリクエスト #${requestData['bookingId']} 受け入れられました!`;
			message = `やあ！あなたの仕事のリクエスト #${requestData['bookingId']}  によって受け入れられました ${requestData['partnerDetails']['name']}  そしてサービスプロバイダーは途中です`;
		} else if (requestLang == 'id') {
			title = `Hore! Permintaan pekerjaan Anda #${requestData['bookingId']} diterima! `;
			message = `Hore! Permintaan pekerjaan Anda #${requestData['bookingId']}  telah diterima oleh ${requestData['partnerDetails']['name']}  dan penyedia layanan sedang dalam perjalanan!`;
		} else if (requestLang == 'hr') {
			title = `Ura! Vaš zahtjev za posao #${requestData['bookingId']} prihvaćeno! `;
			message = `Ura! Vaš zahtjev za posao #${requestData['bookingId']}  je prihvaćen od strane ${requestData['partnerDetails']['name']}  a pružatelj usluga je na putu!`;
		} else if (requestLang == 'ar') {
			title = `يا هلا! طلب عملك #${requestData['bookingId']} وافقت! `;
			message = `يا هلا! طلب عملك #${requestData['bookingId']}  تم قبوله من قبل ${requestData['partnerDetails']['name']}  ومزود الخدمة في الطريق!`;
		}
	}


	if (type === 'arrivedLocation') {
		if (requestLang == 'en') {
			title = `Hello! ${requestData['partnerDetails']['name']} is at your location!`;
			message = `${requestData['partnerDetails']['name']} is reached your location for your job request #${requestData['bookingId']}!`;
		} else if (requestLang == 'es') {
			title = `¡Hola! ${requestData['partnerDetails']['name']} está en su ubicación!`;
			message = `${requestData['partnerDetails']['name']} se ha llegado a su ubicación para su solicitud de trabajo #${requestData['bookingId']}!`;
		} else if (requestLang == 'fr') {
			title = `Bonjour! ${requestData['partnerDetails']['name']} est chez vous !`;
			message = `${requestData['partnerDetails']['name']} is est atteint votre emplacement pour votre demande d'emploi #${requestData['bookingId']}!`;
		} else if (requestLang == 'ru') {
			title = `Привет! ${requestData['partnerDetails']['name']} находится у вас!`;
			message = `${requestData['partnerDetails']['name']} достиг вашего местоположения для вашего запроса на работу #${requestData['bookingId']}! `;
		} else if (requestLang == 'ja') {
			title = `こんにちは! ~${requestData['partnerDetails']['name']} あなたの場所にあります`;
			message = `${requestData['partnerDetails']['name']} あなたの仕事の要求のためにあなたの場所に到達しました #${requestData['bookingId']}!`;
		} else if (requestLang == 'id') {
			title = `Halo! ${requestData['partnerDetails']['name']} ada di lokasi Anda!`;
			message = `${requestData['partnerDetails']['name']} mencapai lokasi Anda untuk permintaan pekerjaan Anda #${requestData['bookingId']}!`;
		} else if (requestLang == 'hr') {
			title = `Zdravo! ${requestData['partnerDetails']['name']} je na vašoj lokaciji!`;
			message = `${requestData['partnerDetails']['name']} je stigla na vašu lokaciju za vaš zahtjev za posao #${requestData['bookingId']}!`;
		} else if (requestLang == 'ar') {
			title = `أهلا! ${requestData['partnerDetails']['name']} في موقعك!`;
			message = `${requestData['partnerDetails']['name']} تم الوصول إلى موقعك لطلب وظيفتك	#${requestData['bookingId']}!`;
		}
	}

	if (type === 'serviceReviewed') {
		if (requestLang == 'en') {
			title = `Good news! ${requestData['partnerDetails']['name']} is reviewed your job request #${requestData['bookingId']}! `;
			message = `${requestData['partnerDetails']['name']} is reviewed your job request #${requestData['bookingId']} at your location!`;
		} else if (requestLang == 'es') {
			title = `¡Buenas noticias! ${requestData['partnerDetails']['name']} se revisa su solicitud de trabajo #${requestData['bookingId']}! `;
			message = `${requestData['partnerDetails']['name']} se revisa su solicitud de trabajo #${requestData['bookingId']} en tu ubicación!`;
		} else if (requestLang == 'fr') {
			title = `Bonnes nouvelles! ${requestData['partnerDetails']['name']} est examiné votre demande d'emploi #${requestData['bookingId']}! `;
			message = `${requestData['partnerDetails']['name']} est examiné votre demande d'emploi #${requestData['bookingId']} à votre emplacement!`;
		} else if (requestLang == 'ru') {
			title = `Хорошие новости! ${requestData['partnerDetails']['name']} рассматривается ваш запрос на работу #${requestData['bookingId']}! `;
			message = `${requestData['partnerDetails']['name']} рассматривается ваш запрос на работу #${requestData['bookingId']} в вашем местоположении!`;
		} else if (requestLang == 'ja') {
			title = `朗報です！ ${requestData['partnerDetails']['name']} あなたの仕事のリクエストを確認します #${requestData['bookingId']}! `;
			message = `${requestData['partnerDetails']['name']} あなたの仕事のリクエストを確認します #${requestData['bookingId']} あなたの場所で!`;
		} else if (requestLang == 'id') {
			title = `Kabar baik! ${requestData['partnerDetails']['name']} ditinjau permintaan pekerjaan Anda #${requestData['bookingId']}! `;
			message = `${requestData['partnerDetails']['name']} ditinjau permintaan pekerjaan Anda #${requestData['bookingId']} di lokasi Anda!`;
		} else if (requestLang == 'hr') {
			title = `Dobre vijesti! ${requestData['partnerDetails']['name']} je pregledan vaš zahtjev za posao #${requestData['bookingId']}! `;
			message = `${requestData['partnerDetails']['name']} je pregledan vaš zahtjev za posao #${requestData['bookingId']} na vašoj lokaciji!`;
		} else if (requestLang == 'ar') {
			title = `أخبار جيدة! ${requestData['partnerDetails']['name']} تمت مراجعة طلب العمل الخاص بك #${requestData['bookingId']}! `;
			message = `${requestData['partnerDetails']['name']} تمت مراجعة طلب العمل الخاص بك	#${requestData['bookingId']} في موقعك!`;
		}
	}

	if (type === 'serviceStarted') {
		if (requestLang == 'en') {
			title = `Ready? Your job request #${requestData['bookingId']} started! `;
			message = `${requestData['partnerDetails']['name']} is started working on your job request #${requestData['bookingId']}!`;
		} else if (requestLang == 'es') {
			title = `¿Listo? Su solicitud de trabajo #${requestData['bookingId']} empezado! `;
			message = `${requestData['partnerDetails']['name']} se inicia a trabajar en su solicitud de trabajo #${requestData['bookingId']}!`;
		} else if (requestLang == 'fr') {
			title = `Prêt? Votre demande de travail #${requestData['bookingId']} a débuté! `;
			message = `${requestData['partnerDetails']['name']} est commencé à travailler sur votre demande de travail #${requestData['bookingId']}!`;
		} else if (requestLang == 'ru') {
			title = `Готовый? Ваша задача запроса #${requestData['bookingId']} начал! `;
			message = `${requestData['partnerDetails']['name']} начинается работать над вашим запросом на работу #${requestData['bookingId']}!`;
		} else if (requestLang == 'ja') {
			title = `準備？あなたの仕事依頼 #${requestData['bookingId']} 始まりました! `;
			message = `${requestData['partnerDetails']['name']} あなたの仕事依頼に取り組んできました #${requestData['bookingId']}!`;
		} else if (requestLang == 'id') {
			title = `Siap? Permintaan Pekerjaan Anda #${requestData['bookingId']} dimulai! `;
			message = `${requestData['partnerDetails']['name']} mulai mengerjakan permintaan pekerjaan Anda #${requestData['bookingId']}!`;
		} else if (requestLang == 'hr') {
			title = `Spreman? Zahtjev za posao #${requestData['bookingId']} započeo! `;
			message = `${requestData['partnerDetails']['name']} je počeo raditi na vašem zahtjevu za posao #${requestData['bookingId']}!`;
		} else if (requestLang == 'ar') {
			title = `مستعد؟ طلب عملك #${requestData['bookingId']} بدأت! `;
			message = `${requestData['partnerDetails']['name']} بدأ العمل على طلب عملك #${requestData['bookingId']}!`;
		}
	}

	if (type === 'subServiceStarted') {
		if (requestLang == 'en') {
			title = `Update! ${requestData['subCategory']} service started for #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} is started working ${requestData['subCategory']} service for #${requestData['bookingId']}!`;
		} else if (requestLang == 'es') {
			title = `Actualizar! ${requestData['subCategory']} el servicio comenzó para #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} se inicia trabajando ${requestData['subCategory']} al servicio #${requestData['bookingId']}!`;
		} else if (requestLang == 'fr') {
			title = `Mettre à jour! ${requestData['subCategory']} Le service a commencé pour #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} est commencé à travailler ${requestData['subCategory']} servir #${requestData['bookingId']}!`;
		} else if (requestLang == 'ru') {
			title = `Обновлять! ${requestData['subCategory']} Сервис начался #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} начинается работает ${requestData['subCategory']} Сервис для #${requestData['bookingId']}!`;
		} else if (requestLang == 'ja') {
			title = `アップデート! ${requestData['subCategory']} サービスが開始されました #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} 仕事を始めました ${requestData['subCategory']} サービス #${requestData['bookingId']}!`;
		} else if (requestLang == 'id') {
			title = `Memperbarui! ${requestData['subCategory']} Layanan dimulai untuk #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} mulai bekerja ${requestData['subCategory']} Layanan untuk. #${requestData['bookingId']}!`;
		} else if (requestLang == 'hr') {
			title = `Ažuriraj! ${requestData['subCategory']} Usluga je započela #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} je počeo raditi ${requestData['subCategory']} za #${requestData['bookingId']}!`;
		} else if (requestLang == 'ar') {
			title = `تحديث! ${requestData['subCategory']} بدأت الخدمة ل #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} بدأ العمل ${requestData['subCategory']} خدمة ل #${requestData['bookingId']}!`;
		}
	}

	if (type === 'subServicePaused') {
		if (requestLang == 'en') {
			title = `Alert! Your job request #${requestData['bookingId']} paused!`;
			message = `${requestData['partnerDetails']['name']} is paused the work ${requestData['subCategory']}  for the job request #${requestData['bookingId']}! `;
		} else if (requestLang == 'es') {
			title = `¡Alerta! Su solicitud de trabajo #${requestData['bookingId']} pausado!`;
			message = `${requestData['partnerDetails']['name']} esta pausa el trabajo ${requestData['subCategory']}  Para la solicitud de trabajo #${requestData['bookingId']}! `;
		} else if (requestLang == 'fr') {
			title = `Alerte! Votre demande de travail #${requestData['bookingId']} s'arrêta!`;
			message = `${requestData['partnerDetails']['name']} est mis en pause le travail ${requestData['subCategory']}  Pour la demande de travail #${requestData['bookingId']}! `;
		} else if (requestLang == 'ru') {
			title = `Тревога! Ваша задача запроса #${requestData['bookingId']} пауз!`;
			message = `${requestData['partnerDetails']['name']} приостановлено на работу ${requestData['subCategory']}  для запроса на работу #${requestData['bookingId']}! `;
		} else if (requestLang == 'ja') {
			title = `alert alert！あなたの仕事依頼 #${requestData['bookingId']} 一時停止しました!`;
			message = `${requestData['partnerDetails']['name']} 仕事を一時停止します ${requestData['subCategory']}  求人要求のために #${requestData['bookingId']}! `;
		} else if (requestLang == 'id') {
			title = `Peringatan! Permintaan Pekerjaan Anda #${requestData['bookingId']} dijeda!`;
			message = `${requestData['partnerDetails']['name']} dijeda pekerjaan ${requestData['subCategory']}  Untuk permintaan pekerjaan #${requestData['bookingId']}! `;
		} else if (requestLang == 'hr') {
			title = `Upozorenje! Zahtjev za posao #${requestData['bookingId']} zastao!`;
			message = `${requestData['partnerDetails']['name']} je zastao posao ${requestData['subCategory']}  Za zahtjev za posao #${requestData['bookingId']}! `;
		} else if (requestLang == 'ar') {
			title = `إنذار! طلب عملك #${requestData['bookingId']} توقفت!`;
			message = `${requestData['partnerDetails']['name']} توقفت العمل ${requestData['subCategory']}  طلب الوظيفة #${requestData['bookingId']}! `;
		}
	}

	if (type === 'subServiceResumed') {
		if (requestLang == 'en') {
			title = `Incoming! Your job request #${requestData['bookingId']} resumed! `;
			message = `${requestData['partnerDetails']['name']} is resumed the work ${requestData['subCategory']}  for the job request #${requestData['bookingId']}! `;
		} else if (requestLang == 'es') {
			title = `¡Entrante! Su solicitud de trabajo #${requestData['bookingId']} reanudado! `;
			message = `${requestData['partnerDetails']['name']} se reanuda el trabajo ${requestData['subCategory']}  Para la solicitud de trabajo #${requestData['bookingId']}! `;
		} else if (requestLang == 'fr') {
			title = `Entrant! Votre demande de travail #${requestData['bookingId']} a repris! `;
			message = `${requestData['partnerDetails']['name']} est repris le travail ${requestData['subCategory']} Pour la demande de travail #${requestData['bookingId']}! `;
		} else if (requestLang == 'ru') {
			title = `Входящие! Ваша задача запроса #${requestData['bookingId']} возобновлено! `;
			message = `${requestData['partnerDetails']['name']} возобновляет работу ${requestData['subCategory']}  для запроса на работу #${requestData['bookingId']}! `;
		} else if (requestLang == 'ja') {
			title = `inc！あなたの仕事依頼 #${requestData['bookingId']} 再開しました! `;
			message = `${requestData['partnerDetails']['name']} 仕事を再開します ${requestData['subCategory']}  求人要求のために #${requestData['bookingId']}! `;
		} else if (requestLang == 'id') {
			title = `Masuk! Permintaan Pekerjaan Anda #${requestData['bookingId']} kembali! `;
			message = `${requestData['partnerDetails']['name']} dilanjutkan pekerjaan ${requestData['subCategory']}  Untuk permintaan pekerjaan #${requestData['bookingId']}! `;
		} else if (requestLang == 'hr') {
			title = `Dolazni! Zahtjev za posao #${requestData['bookingId']} nastavak! `;
			message = `${requestData['partnerDetails']['name']} je nastavljen rad ${requestData['subCategory']}  Za zahtjev za posao #${requestData['bookingId']}! `;
		} else if (requestLang == 'ar') {
			title = `واردة! طلب عملك #${requestData['bookingId']} استئناف! `;
			message = `${requestData['partnerDetails']['name']} استئناف العمل ${requestData['subCategory']}  طلب الوظيفة #${requestData['bookingId']}! `;
		}
	}

	if (type === 'subServiceDone') {
		if (requestLang == 'en') {
			title = `Boom! ${requestData['subCategory']} service completed for #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} is finished the work ${requestData['subCategory']}  for the job request #${requestData['bookingId']}! `;
		} else if (requestLang == 'es') {
			title = `Auge! ${requestData['subCategory']} Servicio completado para #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} ha terminado el trabajo ${requestData['subCategory']}  Para la solicitud de trabajo #${requestData['bookingId']}! `;
		} else if (requestLang == 'fr') {
			title = `Boom! ${requestData['subCategory']} Service terminé pour #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} est terminé le travail ${requestData['subCategory']}  Pour la demande de travail #${requestData['bookingId']}! `;
		} else if (requestLang == 'ru') {
			title = `Бум! ${requestData['subCategory']} Сервис завершен #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} закончил работу ${requestData['subCategory']}  для запроса на работу #${requestData['bookingId']}! `;
		} else if (requestLang == 'ja') {
			title = `ブーム! ${requestData['subCategory']} サービスが完了しました #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} 仕事を終えた ${requestData['subCategory']}  求人要求のために #${requestData['bookingId']}! `;
		} else if (requestLang == 'id') {
			title = `Ledakan! ${requestData['subCategory']} Layanan selesai untuk #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} selesai pekerjaan ${requestData['subCategory']}  Untuk permintaan pekerjaan #${requestData['bookingId']}! `;
		} else if (requestLang == 'hr') {
			title = `Bum! ${requestData['subCategory']} Završena je usluga #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} završava rad ${requestData['subCategory']}  Za zahtjev za posao #${requestData['bookingId']}! `;
		} else if (requestLang == 'ar') {
			title = `فقاعة! ${requestData['subCategory']} اكتملت الخدمة ل #${requestData['bookingId']}!`;
			message = `${requestData['partnerDetails']['name']} انتهى العمل ${requestData['subCategory']}  طلب الوظيفة #${requestData['bookingId']}! `;
		}
	}

	if (type === 'cancelledByPartner') {
		if (requestLang == 'en') {
			title = `Mayday! Mayday! Your job request #${requestData['bookingId']} cancelled!`;
			message = `Your job request #${requestData['bookingId']} has been cancelled by ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'es') {
			title = `¡May Day! ¡May Day! Su solicitud de trabajo #${requestData['bookingId']} cancelado!`;
			message = `Su solicitud de trabajo #${requestData['bookingId']} ha sido cancelado por ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'fr') {
			title = `Au secours! Au secours! Votre demande de travail #${requestData['bookingId']} annulé!`;
			message = `Votre demande de travail #${requestData['bookingId']} a été annulé par ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'ru') {
			title = `Первое мая! Первое мая! Ваша задача запроса #${requestData['bookingId']} отменил!`;
			message = `Ваша задача запроса #${requestData['bookingId']} был отменен ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'ja') {
			title = `メーデー！メーデー！あなたの仕事依頼 #${requestData['bookingId']} キャンセル!`;
			message = `あなたの仕事依頼 #${requestData['bookingId']} によってキャンセルされました ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'id') {
			title = `Mayday! Mayday! Permintaan Pekerjaan Anda #${requestData['bookingId']} dibatalkan!`;
			message = `Permintaan Pekerjaan Anda #${requestData['bookingId']} telah dibatalkan oleh ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'hr') {
			title = `Mayday! Mayday! Zahtjev za posao #${requestData['bookingId']} otkazan!`;
			message = `Zahtjev za posao #${requestData['bookingId']} je otkazan ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'ar') {
			title = `يوما ما! يوما ما! طلب عملك #${requestData['bookingId']} ألغيت!`;
			message = `طلب عملك #${requestData['bookingId']} تم إلغاؤها من قبل ${requestData['partnerDetails']['name']}! `;
		}
	}

	if (type === 'paymentSuccess') {
		if (requestLang == 'en') {
			if (requestData['paymentType'] === 1) {
				title = `Cash-Cash! Receive ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} for work request #${requestData['bookingId']}!`;
				message = `You need to receive ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} for work request #${requestData['bookingId']} from ${requestData['userDetails']['name']}!`;
			} else {
				title = `Earnings! You got a new payment for #${requestData['bookingId']}!`;
				message = `You got ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} payment for #${requestData['bookingId']}! The amount will be transferred to your bank account soon!`;
			}
		} else if (requestLang == 'es') {
			if (requestData['paymentType'] === 1) {
				title = `¡Cash-efectivo! Recibir ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} Para la solicitud de trabajo. #${requestData['bookingId']}!`;
				message = `Necesitas recibir ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} Para la solicitud de trabajo. #${requestData['bookingId']} desde ${requestData['userDetails']['name']}!`;
			} else {
				title = `¡Ganancias! Tienes un nuevo pago por #${requestData['bookingId']}!`;
				message = `Tu tienes ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} Pago por #${requestData['bookingId']}! ¡La cantidad será transferida a su cuenta bancaria pronto!`;
			}
		} else if (requestLang == 'fr') {
			if (requestData['paymentType'] === 1) {
				title = `Cash-Cash! Recevoir ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} Pour la demande de travail #${requestData['bookingId']}!`;
				message = `Vous devez recevoir ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} Pour la demande de travail #${requestData['bookingId']} à partir de ${requestData['userDetails']['name']}!`;
			} else {
				title = `Gains! Vous avez reçu un nouveau paiement pour #${requestData['bookingId']}!`;
				message = `Vous avez ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} paiement pour #${requestData['bookingId']}! Le montant sera transféré sur votre compte bancaire bientôt!`;
			}
		} else if (requestLang == 'ru') {
			if (requestData['paymentType'] === 1) {
				title = `Денежные наличные! Получать ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} для запроса на работу #${requestData['bookingId']}!`;
				message = `Вам нужно получить ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} для запроса на работу #${requestData['bookingId']} от ${requestData['userDetails']['name']}!`;
			} else {
				title = `Доходы! Вы получили новый платеж за #${requestData['bookingId']}!`;
				message = `Ты получил ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} платеж за #${requestData['bookingId']}! Сумма будет передана на ваш банковский счет в ближайшее время!`;
			}
		} else if (requestLang == 'ja') {
			if (requestData['paymentType'] === 1) {
				title = `現金 - 現金！受け取る ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} 仕事依頼のために #${requestData['bookingId']}!`;
				message = `あなたは受け取る必要があります ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} 仕事依頼のために #${requestData['bookingId']} から ${requestData['userDetails']['name']}!`;
			} else {
				title = `earn earn！あなたは新しい支払いを受けました #${requestData['bookingId']}!`;
				message = `あなたが手に入れた ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} 支払い #${requestData['bookingId']}! 金額はすぐにあなたの銀行口座に転送されます！`;
			}
		} else if (requestLang == 'id') {
			if (requestData['paymentType'] === 1) {
				title = `Uang tunai! Menerima ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} untuk permintaan kerja #${requestData['bookingId']}!`;
				message = `Anda perlu menerima ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} untuk permintaan kerja #${requestData['bookingId']} dari ${requestData['userDetails']['name']}!`;
			} else {
				title = `Pendapatan! Anda mendapat pembayaran baru untuk #${requestData['bookingId']}!`;
				message = `Anda dapat ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} pembayaran untuk #${requestData['bookingId']}! Jumlah akan segera ditransfer ke rekening bank Anda!`;
			}
		} else if (requestLang == 'hr') {
			if (requestData['paymentType'] === 1) {
				title = `Cash-Cash! Primati ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} Za zahtjev za radom #${requestData['bookingId']}!`;
				message = `Morate primiti ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} Za zahtjev za radom #${requestData['bookingId']} iz ${requestData['userDetails']['name']}!`;
			} else {
				title = `Zarada! Imate novu uplatu #${requestData['bookingId']}!`;
				message = `Imaš ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} uplata za #${requestData['bookingId']}! Količina će se uskoro prenijeti na vaš bankovni račun!`;
			}
		} else if (requestLang == 'ar') {
			if (requestData['paymentType'] === 1) {
				title = `نقدا نقدا! يستلم ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} لطلب العمل #${requestData['bookingId']}!`;
				message = `تحتاج إلى تلقي ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} لطلب العمل #${requestData['bookingId']} من ${requestData['userDetails']['name']}!`;
			} else {
				title = `الأرباح! حصلت على دفع جديد ل #${requestData['bookingId']}!`;
				message = `أنت حصلت ${formatAmount(requestData['amount'], requestData['currency'], requestLang)} الدفع ل #${requestData['bookingId']}! سيتم نقل المبلغ إلى حسابك المصرفي قريبا!`;
			}
		}
	}

	if (type === 'cashPayment') {
		if (requestLang == 'en') {
			title = `Cash-Cash! You need to pay ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} for work request #${requestData['bookingId']}!`;
			message = `You need to pay ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} for work request #${requestData['bookingId']} to ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'es') {
			title = `¡Cash-efectivo! Necesitas pagar ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} Para la solicitud de trabajo. #${requestData['bookingId']}!`;
			message = `Necesitas pagar ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} Para la solicitud de trabajo. #${requestData['bookingId']} para ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'fr') {
			title = `Cash-Cash! Vous devez payer ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} Pour la demande de travail #${requestData['bookingId']}!`;
			message = `Vous devez payer ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} Pour la demande de travail #${requestData['bookingId']} pour ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'ru') {
			title = `Денежные наличные! Вам нужно заплатить ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} для запроса на работу #${requestData['bookingId']}!`;
			message = `Вам нужно заплатить ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} для запроса на работу #${requestData['bookingId']} к ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'ja') {
			title = `現金 - 現金！あなたは払う必要があります ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} 仕事依頼のために #${requestData['bookingId']}!`;
			message = `あなたは払う必要があります ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} 仕事依頼のために #${requestData['bookingId']} に ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'id') {
			title = `Uang tunai! Anda perlu membayar ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} untuk permintaan kerja #${requestData['bookingId']}!`;
			message = `Anda perlu membayar ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} untuk permintaan kerja #${requestData['bookingId']} ke ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'hr') {
			title = 'Yay! Vaša vožnja je završena!';
			title = `Cash-Cash! Trebate platiti ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} Za zahtjev za radom #${requestData['bookingId']}!`;
			message = `Trebate platiti ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} Za zahtjev za radom #${requestData['bookingId']} do ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'ar') {
			title = `نقدا نقدا! انت تحتاج للدفع ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} لطلب العمل #${requestData['bookingId']}!`;
			message = `انت تحتاج للدفع ${formatAmount(requestData['partnerTotalFare'], requestData['userCurrency'], requestLang)} لطلب العمل #${requestData['bookingId']} ل ${requestData['partnerDetails']['name']}! `;
		}
	}

	if (type === 'serviceCompletedUser') {
		if (requestLang == 'en') {
			title = `Done! Your job request #${requestData['bookingId']} Completed! `;
			message = `${requestData['partnerDetails']['name']} has completed the job request #${requestData['bookingId']}`;
		} else if (requestLang == 'es') {
			title = `¡Hecho! Su solicitud de trabajo #${requestData['bookingId']} Terminado! `;
			message = `${requestData['partnerDetails']['name']} ha completado la solicitud de trabajo #${requestData['bookingId']}`;
		} else if (requestLang == 'fr') {
			title = `Terminé! Votre demande de travail #${requestData['bookingId']} Complété! `;
			message = `${requestData['partnerDetails']['name']} a terminé la demande de travail #${requestData['bookingId']}`;
		} else if (requestLang == 'ru') {
			title = `Сделанный! Ваша задача запроса #${requestData['bookingId']} Завершенный! `;
			message = `${requestData['partnerDetails']['name']} завершил запрос на работу #${requestData['bookingId']}`;
		} else if (requestLang == 'ja') {
			title = `終わり！あなたの仕事依頼 #${requestData['bookingId']} 完了しました! `;
			message = `${requestData['partnerDetails']['name']} ジョブリクエストを完了しました #${requestData['bookingId']}`;
		} else if (requestLang == 'id') {
			title = `Selesai! Permintaan Pekerjaan Anda #${requestData['bookingId']} Lengkap! `;
			message = `${requestData['partnerDetails']['name']} telah menyelesaikan permintaan pekerjaan #${requestData['bookingId']}`;
		} else if (requestLang == 'hr') {
			title = `Učinio! Zahtjev za posao #${requestData['bookingId']} Dovršen! `;
			message = `${requestData['partnerDetails']['name']} je završio zahtjev za posao #${requestData['bookingId']}`;
		} else if (requestLang == 'ar') {
			title = `منجز! طلب عملك #${requestData['bookingId']} مكتمل! `;
			message = `${requestData['partnerDetails']['name']} أكمل طلب الوظيفة #${requestData['bookingId']}`;
		}
	}

	if (type === 'serviceCompletedPartner') {
		if (requestLang == 'en') {
			title = `Impressive-Work! You have completed the job request #${requestData['bookingId']}!`;
			message = `You have completed the job request #${requestData['bookingId']} for ${requestData['userDetails']['name']}! `;
		} else if (requestLang == 'es') {
			title = `Impresionante trabajo! Has completado la solicitud de trabajo. #${requestData['bookingId']}!`;
			message = `Has completado la solicitud de trabajo. #${requestData['bookingId']} por ${requestData['userDetails']['name']}! `;
		} else if (requestLang == 'fr') {
			title = `Travail impressionnant! Vous avez terminé la demande de travail #${requestData['bookingId']}!`;
			message = `Vous avez terminé la demande de travail #${requestData['bookingId']} pour ${requestData['userDetails']['name']}! `;
		} else if (requestLang == 'ru') {
			title = `Впечатляющая работа! Вы завершили запрос на работу #${requestData['bookingId']}!`;
			message = `Вы завершили запрос на работу #${requestData['bookingId']} для ${requestData['userDetails']['name']}! `;
		} else if (requestLang == 'ja') {
			title = `印象的な仕事！あなたは仕事の要求を完了しました #${requestData['bookingId']}!`;
			message = `あなたは仕事の要求を完了しました #${requestData['bookingId']} ために ${requestData['userDetails']['name']}! `;
		} else if (requestLang == 'id') {
			title = `Kerja yang mengesankan! Anda telah menyelesaikan permintaan pekerjaan #${requestData['bookingId']}!`;
			message = `Anda telah menyelesaikan permintaan pekerjaan #${requestData['bookingId']} untuk ${requestData['userDetails']['name']}! `;
		} else if (requestLang == 'hr') {
			title = `Impresivan-rad! Završili ste zahtjev za posao #${requestData['bookingId']}!`;
			message = `Završili ste zahtjev za posao #${requestData['bookingId']} za ${requestData['userDetails']['name']}! `;
		} else if (requestLang == 'ar') {
			title = `عمل مثير للإعجاب! لقد أكملت طلب الوظيفة #${requestData['bookingId']}!`;
			message = `لقد أكملت طلب الوظيفة #${requestData['bookingId']} بالنسبة ${requestData['userDetails']['name']}! `;
		}
	}

	if (type === 'serviceDeclined') {
		if (requestLang == 'en') {
			title = `Oops! No service provider available for #${requestData['bookingId']}!`;
			message = `Apologize, No service provider available for your job request #${requestData['bookingId']}. Please try again.`;
		} else if (requestLang == 'es') {
			title = `¡UPS! Ningún proveedor de servicios disponible para #${requestData['bookingId']}!`;
			message = `Pido disculpas, ningún proveedor de servicios disponible para su solicitud de trabajo #${requestData['bookingId']}. Inténtalo de nuevo.`;
		} else if (requestLang == 'fr') {
			title = `Oups! Aucun fournisseur de services disponible pour #${requestData['bookingId']}!`;
			message = `Copologize, aucun fournisseur de services disponible pour votre demande de travail #${requestData['bookingId']}. Veuillez réessayer.`;
		} else if (requestLang == 'ru') {
			title = `Упс! Поставщик услуг не доступен для #${requestData['bookingId']}!`;
			message = `Извинитесь, нет поставщика услуг для вашего запроса на работу #${requestData['bookingId']}. Пожалуйста, попробуйте еще раз.`;
		} else if (requestLang == 'ja') {
			title = `おっと！利用可能なサービスプロバイダはありません #${requestData['bookingId']}!`;
			message = `申し訳ありませんが、あなたの仕事の要求に利用できるサービスプロバイダはありません #${requestData['bookingId']}. もう一度やり直してください.`;
		} else if (requestLang == 'id') {
			title = `Ups! Tidak ada penyedia layanan yang tersedia untuk #${requestData['bookingId']}!`;
			message = `Minta maaf, tidak ada penyedia layanan yang tersedia untuk permintaan pekerjaan Anda #${requestData['bookingId']}. Silakan coba lagi.`;
		} else if (requestLang == 'hr') {
			title = `Ups! Nijedan davatelj usluga nije dostupan #${requestData['bookingId']}!`;
			message = `Ispričajte se, bez davatelja usluga na raspolaganju za vaš zahtjev za posao #${requestData['bookingId']}. Molim te pokušaj ponovno.`;
		} else if (requestLang == 'ar') {
			title = `وجه الفتاة! لا مزود خدمة المتاحة ل #${requestData['bookingId']}!`;
			message = `الاعتذار، لا مزود خدمة متاح طلب عملك #${requestData['bookingId']}. حاول مرة اخرى.`;
		}
	}



	if (type === 'forceUpdate') { // App FORCE UPDATE
		if (requestLang == 'en') {
			message = 'Uh! The version you use is out of date. We have some cool updates in the store. Please update the app to use it further.';
		} else if (requestLang == 'es') {
			message = '¡Oh! La versión que usas está desactualizada. Tenemos algunas actualizaciones geniales en la tienda. Actualice la aplicación para usarla más.';
		} else if (requestLang == 'fr') {
			message = "Euh! La version que vous utilisez est obsolète. Nous avons quelques mises à jour intéressantes dans le magasin. Veuillez mettre à jour l'application pour l'utiliser davantage.";
		} else if (requestLang == 'ru') {
			message = 'Эм-м-м! Используемая вами версия устарела. У нас есть несколько крутых обновлений в магазине. Пожалуйста, обновите приложение, чтобы использовать его дальше.';
		} else if (requestLang == 'ja') {
			message = 'ええと！使用しているバージョンが古くなっています。ストアにはいくつかのクールなアップデートがあります。さらに使用するには、アプリを更新してください。';
		} else if (requestLang == 'id') {
			message = 'eh! Versi yang Anda gunakan sudah kedaluwarsa. Kami memiliki beberapa pembaruan keren di toko. Harap perbarui aplikasi untuk menggunakannya lebih lanjut.';
		} else if (requestLang == 'hr') {
			message = 'Uh! Verzija koju koristite je zastarjela. Imamo nekoliko zanimljivih ažuriranja u trgovini. Ažurirajte aplikaciju da biste je dalje koristili.';
		} else if (requestLang == 'ar') {
			message = 'أوه! الإصدار الذي تستخدمه قديم. لدينا بعض التحديثات الرائعة في المتجر. يرجى تحديث التطبيق لاستخدامه بشكل أكبر.';
		}
	}


	if (type === 'newMessage') {
		if (requestLang == 'en') {
			title = `Ting! You got a new message from ${requestData['senderName']}`;
		} else if (requestLang == 'es') {
			title = `¡Ting! Tienes un nuevo mensaje de ${requestData['senderName']}`;
		} else if (requestLang == 'fr') {
			title = `Ting! Vous avez reçu un nouveau message de ${requestData['senderName']}`;
		} else if (requestLang == 'ru') {
			title = `Тинг! Вы получили новое сообщение от ${requestData['senderName']}`;
		} else if (requestLang == 'ja') {
			title = `ね！あなたはから新しいメッセージを得ました ${requestData['senderName']}`;
		} else if (requestLang == 'id') {
			title = `! Anda mendapat pesan baru dari ${requestData['senderName']}`;
		} else if (requestLang == 'hr') {
			title = `Ting! Imate novu poruku ${requestData['senderName']}`;
		} else if (requestLang == 'ar') {
			title = `تينغ! حصلت على رسالة جديدة من ${requestData['senderName']}`;
		}

		message = requestData && requestData.message;
	}

	if (type === 'serviceProviderTip') {
		if (requestLang == 'en') {
			title = `Good-work! You got a tip for #${requestData['bookingId']}!`;
			message = `You got ${formatAmount(requestData['amount'], requestData['convertCurrency'], requestLang)} tip from ${requestData['userName']} for #${requestData['bookingId']} ! `;
		} else if (requestLang == 'es') {
			title = `¡Buen trabajo! Tienes un consejo para #${requestData['bookingId']}!`;
			message = `Tu tienes ${formatAmount(requestData['amount'], requestData['convertCurrency'], requestLang)} inclinarse de ${requestData['userName']} por #${requestData['bookingId']} ! `;
		} else if (requestLang == 'fr') {
			title = `Bon travail! Vous avez un conseil pour #${requestData['bookingId']}!`;
			message = `Vous avez ${formatAmount(requestData['amount'], requestData['convertCurrency'], requestLang)} se pencher de ${requestData['userName']} pour #${requestData['bookingId']} ! `;
		} else if (requestLang == 'ru') {
			title = `Хорошая работа! Вы получили совет для #${requestData['bookingId']}!`;
			message = `Ты получил ${formatAmount(requestData['amount'], requestData['convertCurrency'], requestLang)} совет от ${requestData['userName']} для #${requestData['bookingId']} ! `;
		} else if (requestLang == 'ja') {
			title = `よくできました！あなたは先端を得ました #${requestData['bookingId']}!`;
			message = `あなたが手に入れた ${formatAmount(requestData['amount'], requestData['convertCurrency'], requestLang)} からの先端に ${requestData['userName']} ために #${requestData['bookingId']} ! `;
		} else if (requestLang == 'id') {
			title = `Kerja bagus! Anda mendapat tip untuk #${requestData['bookingId']}!`;
			message = `Anda dapat ${formatAmount(requestData['amount'], requestData['convertCurrency'], requestLang)} Kiat dari 8. ${requestData['userName']} untuk #${requestData['bookingId']} ! `;
		} else if (requestLang == 'hr') {
			title = `Dobar posao! Imaš savjet #${requestData['bookingId']}!`;
			message = `Imaš ${formatAmount(requestData['amount'], requestData['convertCurrency'], requestLang)} vršiti ${requestData['userName']} za #${requestData['bookingId']} ! `;
		} else if (requestLang == 'ar') {
			title = `عمل جيد! لديك نصيحة ل #${requestData['bookingId']}!`;
			message = `أنت حصلتt ${formatAmount(requestData['amount'], requestData['convertCurrency'], requestLang)} نصيحة من ${requestData['userName']} بالنسبة #${requestData['bookingId']} ! `;
		}
	}

	if (type === 'userTip') {
		if (requestLang == 'en') {
			title = `You are always best to give tips!`;
			message = `You gave ${formatAmount(requestData['userAmount'], requestData['currency'], requestLang)} tip to ${requestData['partnerName']} for #${requestData['bookingId']}`;
		} else if (requestLang == 'es') {
			title = `¡Siempre eres mejor para dar consejos!`;
			message = `Diste ${formatAmount(requestData['userAmount'], requestData['currency'], requestLang)} consejo para ${requestData['partnerName']} por #${requestData['bookingId']}`;
		} else if (requestLang == 'fr') {
			title = `Vous êtes toujours préférable de donner des conseils!`;
			message = `Vous avez donné ${formatAmount(requestData['userAmount'], requestData['currency'], requestLang)} pointe ${requestData['partnerName']} pour #${requestData['bookingId']}`;
		} else if (requestLang == 'ru') {
			title = `Вам всегда лучше всего давать советы!`;
			message = `Ты дал ${formatAmount(requestData['userAmount'], requestData['currency'], requestLang)} совет к ${requestData['partnerName']} для #${requestData['bookingId']}`;
		} else if (requestLang == 'ja') {
			title = `あなたは常にヒントを与えるのが一番です！`;
			message = `あなたはあげました ${formatAmount(requestData['userAmount'], requestData['currency'], requestLang)} チップ ${requestData['partnerName']} ために #${requestData['bookingId']}`;
		} else if (requestLang == 'id') {
			title = `Anda selalu terbaik untuk memberikan tips!`;
			message = `Anda memberi ${formatAmount(requestData['userAmount'], requestData['currency'], requestLang)} Tip ke ${requestData['partnerName']} untuk #${requestData['bookingId']}`;
		} else if (requestLang == 'hr') {
			title = `Uvijek si najbolje dati savjete!`;
			message = `Dao si ${formatAmount(requestData['userAmount'], requestData['currency'], requestLang)} vršiti ${requestData['partnerName']} za #${requestData['bookingId']}`;
		} else if (requestLang == 'ar') {
			title = `أنت دائما أفضل لإعطاء نصائح!`;
			message = `أنت أعطيت ${formatAmount(requestData['userAmount'], requestData['currency'], requestLang)} طرف إلى ${requestData['partnerName']} بالنسبة #${requestData['bookingId']}`;
		}
	}

	if (type === 'additionalWork') {
		if (requestLang == 'en') {
			title = `Emergency! Additional work added to your job request #${requestData['bookingId']}!`;
			message = `${formatAmount(requestData['additionalFee'], requestData['currency'], requestLang)} has been added to your billing for some additional work on #${requestData['bookingId']} by ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'es') {
			title = `¡Emergencia! Trabajo adicional agregado a su solicitud de trabajo #${requestData['bookingId']}!`;
			message = `${formatAmount(requestData['additionalFee'], requestData['currency'], requestLang)} se ha agregado a su facturación por algún trabajo adicional en #${requestData['bookingId']} por ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'fr') {
			title = `Urgence! Travail supplémentaire ajouté à votre demande de travail #${requestData['bookingId']}!`;
			message = `${formatAmount(requestData['additionalFee'], requestData['currency'], requestLang)} a été ajouté à votre facturation pour des travaux supplémentaires sur #${requestData['bookingId']} par ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'ru') {
			title = `Чрезвычайное происшествие! Дополнительная работа, добавленная к вашему запросу на работу #${requestData['bookingId']}!`;
			message = `${formatAmount(requestData['additionalFee'], requestData['currency'], requestLang)} был добавлен к вашему выставочному счету за дополнительную работу на #${requestData['bookingId']} к ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'ja') {
			title = `緊急！あなたの仕事依頼に追加の作業が追加されました #${requestData['bookingId']}!`;
			message = `${formatAmount(requestData['additionalFee'], requestData['currency'], requestLang)} いくつかの追加の作業のためにあなたの請求に追加されました #${requestData['bookingId']} に ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'id') {
			title = `Keadaan darurat! Pekerjaan tambahan ditambahkan ke permintaan pekerjaan Anda #${requestData['bookingId']}!`;
			message = `${formatAmount(requestData['additionalFee'], requestData['currency'], requestLang)} telah ditambahkan ke tagihan Anda untuk beberapa pekerjaan tambahan #${requestData['bookingId']} oleh ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'hr') {
			title = `Hitna! Dodatni rad dodan je vašem zahtjevu za poslu #${requestData['bookingId']}!`;
			message = `${formatAmount(requestData['additionalFee'], requestData['currency'], requestLang)} dodana je vašem naplatu za dodatni rad na #${requestData['bookingId']} po ${requestData['partnerDetails']['name']}! `;
		} else if (requestLang == 'ar') {
			title = `طارئ! العمل الإضافي المضافة إلى طلب عملك #${requestData['bookingId']}!`;
			message = `${formatAmount(requestData['additionalFee'], requestData['currency'], requestLang)} تمت إضافته إلى الفواتير الخاصة بك لبعض العمل الإضافي #${requestData['bookingId']} بواسطة ${requestData['partnerDetails']['name']}! `;
		}
	}

	if (type === 'userRating') {
		if (requestLang == 'en') {
			title = `Hello! You got a rating from ${requestData['partnerName']} for #${requestData['bookingId']}!`;
			message = `You got a rating from ${requestData['partnerName']} for #${requestData['bookingId']}! `;
		} else if (requestLang == 'es') {
			title = `¡Hola! Tienes una calificación de ${requestData['partnerName']} por #${requestData['bookingId']}!`;
			message = `Tienes una calificación de ${requestData['partnerName']} por #${requestData['bookingId']}! `;
		} else if (requestLang == 'fr') {
			title = `Bonjour! Vous avez une note de ${requestData['partnerName']} pour #${requestData['bookingId']}!`;
			message = `Vous avez une note de ${requestData['partnerName']} pour #${requestData['bookingId']}! `;
		} else if (requestLang == 'ru') {
			title = `Привет! Вы получили рейтинг от ${requestData['partnerName']} для #${requestData['bookingId']}!`;
			message = `Привет! Вы получили рейтинг от ${requestData['partnerName']} для #${requestData['bookingId']}! `;
		} else if (requestLang == 'ja') {
			title = `こんにちは！あなたはからの評価を得ました ${requestData['partnerName']} ために #${requestData['bookingId']}!`;
			message = `こんにちは！あなたはからの評価を得ました ${requestData['partnerName']} ために #${requestData['bookingId']}! `;
		} else if (requestLang == 'id') {
			title = `Halo! Anda mendapat peringkat dari ${requestData['partnerName']} untuk #${requestData['bookingId']}!`;
			message = `Halo! Anda mendapat peringkat dari ${requestData['partnerName']} untuk #${requestData['bookingId']}! `;
		} else if (requestLang == 'hr') {
			title = `Zdravo! Imate ocjenu od ${requestData['partnerName']} za #${requestData['bookingId']}!`;
			message = `Zdravo! Imate ocjenu od ${requestData['partnerName']} za #${requestData['bookingId']}! `;
		} else if (requestLang == 'ar') {
			title = `أهلا! حصلت على تصنيف من ${requestData['partnerName']} بالنسبة #${requestData['bookingId']}!`;
			message = `حصلت على تصنيف من ${requestData['partnerName']} بالنسبة #${requestData['bookingId']}! `;
		}
	}

	if (type === 'partnerRating') {
		if (requestLang == 'en') {
			title = `Great! You got a rating from ${requestData['userName']} for your service on #${requestData['bookingId']}!`;
			message = `You got a rating from ${requestData['userName']} for your service on #${requestData['bookingId']}! `;
		} else if (requestLang == 'es') {
			title = `¡Genial! Tienes una calificación de ${requestData['userName']} Para su servicio en #${requestData['bookingId']}!`;
			message = `Tienes una calificación de ${requestData['userName']} Para su servicio en #${requestData['bookingId']}! `;
		} else if (requestLang == 'fr') {
			title = `Génial! Vous avez une note de ${requestData['userName']} Pour votre service sur #${requestData['bookingId']}!`;
			message = `Vous avez une note de ${requestData['userName']} Pour votre service sur #${requestData['bookingId']}! `;
		} else if (requestLang == 'ru') {
			title = `Здорово! Вы получили рейтинг от ${requestData['userName']} Для вашего обслуживания на #${requestData['bookingId']}!`;
			message = `Вы получили рейтинг от ${requestData['userName']} Для вашего обслуживания на #${requestData['bookingId']}! `;
		} else if (requestLang == 'ja') {
			title = `すごい！あなたはからの評価を得ました ${requestData['userName']} あなたのサービスのために #${requestData['bookingId']}!`;
			message = `すごい！あなたはからの評価を得ました ${requestData['userName']} あなたのサービスのために #${requestData['bookingId']}! `;
		} else if (requestLang == 'id') {
			title = `Besar! Anda mendapat peringkat dari ${requestData['userName']} Untuk layanan Anda di #${requestData['bookingId']}!`;
			message = `Anda mendapat peringkat dari ${requestData['userName']} Untuk layanan Anda di #${requestData['bookingId']}! `;
		} else if (requestLang == 'hr') {
			title = `Sjajno! Imate ocjenu od ${requestData['userName']} za vašu uslugu #${requestData['bookingId']}!`;
			message = `Imate ocjenu od ${requestData['userName']} za vašu uslugu #${requestData['bookingId']}! `;
		} else if (requestLang == 'ar') {
			title = `رائعة! حصلت على تصنيف من ${requestData['userName']} لخدمتكم على #${requestData['bookingId']}!`;
			message = `حصلت على تصنيف من ${requestData['userName']} لخدمتكم على #${requestData['bookingId']}! `;
		}
	}

	if (type === 'noProviderFound') {
		if (requestLang == 'en') {
			title = `Apologize! No service provider available at the moment!`;
			message = `Apologize! No service provider available at the moment! Keep try with different requirements!`;
		} else if (requestLang == 'es') {
			title = `¡Pedir disculpas! ¡Ningún proveedor de servicios disponible en este momento!`;
			message = `¡Pedir disculpas! Ningún proveedor de servicios disponible en este momento! Siga intento con diferentes requisitos.!`;
		} else if (requestLang == 'fr') {
			title = `S'excuser! Aucun fournisseur de services disponible pour le moment!`;
			message = `S'excuser! Aucun fournisseur de services disponible pour le moment! Continuez à essayer avec différentes exigences!`;
		} else if (requestLang == 'ru') {
			title = `Извиняться! На данный момент нет поставщика услуг!`;
			message = `Извиняться! Нет поставщика услуг в данный момент! Продолжайте попробовать с разными требованиями!`;
		} else if (requestLang == 'ja') {
			title = `謝罪！現時点で利用可能なサービスプロバイダはありません！`;
			message = `謝罪！瞬間にサービスプロバイダはありません! さまざまな要件で試してください!`;
		} else if (requestLang == 'id') {
			title = `Meminta maaf! Tidak ada penyedia layanan yang tersedia saat ini!`;
			message = `Meminta maaf! Tidak ada penyedia layanan yang tersedia saat ini! Cobalah dengan persyaratan yang berbeda!`;
		} else if (requestLang == 'hr') {
			title = `Ispričavati! Trenutno nema davatelja usluga!`;
			message = `Ispričavati! Trenutno nije dostupan davatelj usluga! Pokušajte s različitim zahtjevima!`;
		} else if (requestLang == 'ar') {
			title = `اعتذر! لا مزود خدمة متاح في الوقت الحالي!`;
			message = `اعتذر! لا يوجد مزود خدمة متاح في الوقت الحالي! استمر في المحاولة بمتطلبات مختلفة!`;
		}
	}


	if (type === 'cancelledByUser') {
		if (requestLang == 'en') {
			title = `Oops! ${requestData['userDetails']['name']} cancelled the job request!`;
			message = `${requestData['userDetails']['name']} has been cancelled the job request! The new job requests may assign to you!`;
		} else if (requestLang == 'es') {
			title = `¡UPS! ${requestData['userDetails']['name']} ¡Cancelado la solicitud de trabajo!`;
			message = `${requestData['userDetails']['name']} ha sido cancelado la solicitud de trabajo! ¡Las nuevas solicitudes de trabajo pueden asignarle!`;
		} else if (requestLang == 'fr') {
			title = `Oups! ${requestData['userDetails']['name']} annulé la demande de travail!`;
			message = `${requestData['userDetails']['name']} a été annulé la demande de travail! Les nouvelles demandes d'emploi peuvent vous attribuer!`;
		} else if (requestLang == 'ru') {
			title = `Ой! ${requestData['userDetails']['name']} Отменил запрос на работу!`;
			message = `${requestData['userDetails']['name']} был отменен запрос на работу! Новые запросы на работу могут присвоить вам!`;
		} else if (requestLang == 'ja') {
			title = `おっと! ${requestData['userDetails']['name']} ジョブ要求をキャンセルしました！`;
			message = `${requestData['userDetails']['name']} ジョブ要求がキャンセルされました！新しいジョブ要求はあなたに割り当てることができます`;
		} else if (requestLang == 'id') {
			title = `Ups.! ${requestData['userDetails']['name']} membatalkan permintaan pekerjaan!`;
			message = `${requestData['userDetails']['name']} telah membatalkan permintaan pekerjaan! Permintaan pekerjaan baru dapat menetapkan untuk Anda!`;
		} else if (requestLang == 'hr') {
			title = `Oops! ${requestData['userDetails']['name']} Otkazano je zahtjev za posao!`;
			message = `${requestData['userDetails']['name']} je otkazan zahtjev za posao! Novi zahtjevi za posao mogu vam dodijeliti!`;
		} else if (requestLang == 'ar') {
			title = `وجه الفتاة! ${requestData['userDetails']['name']} ألغيت طلب الوظيفة!`;
			message = `${requestData['userDetails']['name']} تم إلغاؤه طلب العمل! قد تعين طلبات الوظائف الجديدة!`;
		}
	}

	if (type === 'scheduleInitiate') {
		if (requestLang == 'en') {
			title = 'Great! We are searching for the nearby service providers for your service!';
			message = 'Great! We are searching for the nearby service providers for your service. Your booking ID #' + requestData['bookingId'];
		} else if (requestLang == 'es') {
			title = '¡Estupendo! Estamos buscando a los proveedores de servicios cercanos para su servicio.!';
			message = '¡Estupendo! Estamos buscando a los proveedores de servicios cercanos para su servicio.. Su identificación de reserva #' + requestData['bookingId'];
		} else if (requestLang == 'fr') {
			title = 'Génial! Nous recherchons les fournisseurs de services à proximité pour votre service!';
			message = 'Génial! Nous recherchons les fournisseurs de services à proximité pour votre service. Votre identifiant de réservation #' + requestData['bookingId'];
		} else if (requestLang == 'ru') {
			title = 'Большой! Мы ищем соседних поставщиков услуг для вашего обслуживания!';
			message = 'Большой! Мы ищем соседних поставщиков услуг для вашего обслуживания. Ваш номер бронирования #' + requestData['bookingId'];
		} else if (requestLang == 'ja') {
			title = '素晴らしい！私たちはあなたのサービスのために近くのサービスプロバイダーを探しています!';
			message = '素晴らしい！私たちはあなたのサービスのために近くのサービスプロバイダーを探しています. 予約ID #' + requestData['bookingId'];
		} else if (requestLang == 'id') {
			title = 'Besar! Kami mencari penyedia layanan terdekat untuk layanan Anda!';
			message = 'Besar! Kami mencari penyedia layanan terdekat untuk layanan Anda. ID pemesanan Anda #' + requestData['bookingId'];
		} else if (requestLang == 'hr') {
			title = 'Sjajno! Tražimo obližnje usluge za vašu uslugu!';
			message = 'Sjajno! Tražimo obližnje usluge za vašu uslugu. Vaš rezervacijski ID #' + requestData['bookingId'];
		} else if (requestLang == 'ar') {
			title = 'عظيم! نحن نبحث عن مقدمي الخدمات القريب لخدمتك!';
			message = requestData['bookingId'] + 'عظيم! نحن نبحث عن مقدمي الخدمات القريب لخدمتك';
		}
	}

	return {
		title,
		message
	};
}

export function formatAmount(amount, currency, locale) {
	let convertCurrency = 'USD';
	if (amount) {
		convertCurrency = currency ? currency : convertCurrency;
		return amount.toLocaleString(locale, { style: 'currency', currency: convertCurrency });
	} else {
		return null;
	}
}
(function () {
    'use strict';

    // ძირითადი ფუნქცია, რომელიც გახსნის ქართულ ფლეერს
    function startGeoOnline(object) {
        var title = object.original_title || object.title;
        
        // ვქმნით ლამპას სტანდარტულ პოპაპ/მენიუს ფანჯარას
        var modal = $('<div><div class="broadcast__text" style="text-align:center; padding: 20px;">იტვირთება ქართული წყაროები...</div></div>');
        
        Lampa.Select.show({
            title: 'ქართული წყაროები',
            items: [
                {
                    title: 'MyKadri (ტესტი ჩაიტვირთა)',
                    subtitle: '1080p • GEO',
                    url: 'https://demo.unified-streaming.com/kaltura/the-secret-life-of-pets.isml/.m3u8'
                }
            ],
            onSelect: function (item) {
                // როცა მომხმარებელი დააწვება ფილმს, ირთვება ლამპას პლეერი
                Lampa.Player.play({
                    url: item.url,
                    title: title
                });
                
                // ვნიშნავთ პლეერს, რომ მუშაობს
                Lampa.Player.playlist([item]);
            },
            onBack: function () {
                Lampa.Controller.toggle('full_start');
            }
        });
    }

    // ვარეგისტრირებთ პლაგინს ლამპას სისტემაში
    if (window.Lampa) {
        Lampa.Plugins.add('georgian_sources', {
            title: 'Georgian Streaming',
            description: 'ქართული საიტების ძებნა',
            auth: false,
            start: function () {
                // ვუსმენთ ფილმის გვერდის გახსნას ინტერფეისში
                Lampa.Events.on('activity', function (event) {
                    if (event.component === 'full' && event.type === 'start') {
                        var activity = event.target;
                        
                        // ვამატებთ ახალ ღილაკს ფილმის მენიუში, ბალანსერების გვერდით
                        var button = $('<div class="full-start__button selector button--geo" style="background: #24b47e; color: #fff;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px; vertical-align: middle;"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg><span style="vertical-align: middle;">ყურება ქართულად</span></div>');
                        
                        button.on('hover:enter', function () {
                            startGeoOnline(activity.data);
                        });

                        // ვსვამთ ღილაკს ლამპას სტანდარტული ღილაკების პანელში
                        activity.dom.find('.full-start__buttons').append(button);
                    }
                });
            }
        });
    }
})();

'use strict';
var multiItemSliderScreenshots = (function () {
    return function (selector, config) {
        var
            _mainElement = document.querySelector(selector), // основный элемент блока
            _sectionScreenshots = _mainElement.querySelector('.screenshots .vertical_wrapper_page'),
            _sliderWrapper = _mainElement.querySelector('section.screenshots .slider__wrapper'), // обертка для .slider-item
            _sliderItems = _mainElement.querySelectorAll('section.screenshots .slider__item'), // элементы (.slider-item)
            _sliderControls = _mainElement.querySelectorAll('section.screenshots .slider__control'), // элементы управления
            _sliderControlLeft = _mainElement.querySelector('section.screenshots .slider__control_left'), // кнопка "LEFT"
            _sliderControlRight = _mainElement.querySelector('section.screenshots .slider__control_right'), // кнопка "RIGHT"
            _sectionScreenshotsWidth = parseFloat(getComputedStyle(_sectionScreenshots).width), // ширина экрана
            _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
            _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
            _positionLeftItem = 0, // позиция левого активного элемента
            _indexActiveItem = 0, // индекс активного элемента
            _transform = 0, // значение транфсофрмации .slider_wrapper
            _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
            _items = [], // массив элементов
             _startX = 0,
            _interval = 0,
            _config = {
                isCycling: false, // автоматическая смена слайдов
                direction: 'right', // направление смены слайдов
                interval: 5000, // интервал между автоматической сменой слайдов
                pause: true // устанавливать ли паузу при поднесении курсора к слайдеру
            };

        for (var key in config) {
            if (key in _config) {
                _config[key] = config[key];
            }
        }
        // наполнение массива _items
        _sliderItems.forEach(function (item, index) {
            _items.push({ item: item, position: index, transform: 0 });
        });
        if(_sectionScreenshotsWidth < 881) {
            _sliderItems[_indexActiveItem].classList.add("first_left_slide");
            _sliderItems[_indexActiveItem + 1].classList.add("second_slide");
            _sliderItems[_indexActiveItem + 2].classList.add("third_slide");
        } else {
            _sliderItems[_indexActiveItem].classList.add("first_left_slide");
            _sliderItems[_indexActiveItem + 1].classList.add("second_slide");
            _sliderItems[_indexActiveItem + 2].classList.add("third_slide");
            _sliderItems[_indexActiveItem + 3].classList.add("main_slide");
            _sliderItems[_indexActiveItem + 4].classList.add("third_slide");
            _sliderItems[_indexActiveItem + 5].classList.add("second_slide");
            _sliderItems[_indexActiveItem + 6].classList.add("first_right_slide");
        }
        var length = _items.length;
        console.log(length);
        console.log(_sectionScreenshotsWidth);
        var position = {
            getItemMin: function () {
                var indexItem = 0;
                _items.forEach(function (item, index) {
                    if (item.position < _items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getItemMax: function () {
                var indexItem = 0;
                _items.forEach(function (item, index) {
                    if (item.position > _items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getMin: function () {
                return _items[position.getItemMin()].position;
            },
            getMax: function () {
                return _items[position.getItemMax()].position;
            }
        }


        var _transformItem = function (direction) {
            var nextItem;
            for( var i = 0; i< length; i++){
                _sliderItems[i].classList.remove("first_right_slide", "second_slide", "third_slide", "main_slide", "first_left_slide");
            }
            if (direction === 'right') {
                _positionLeftItem++;
                _indexActiveItem++;
                _indexActiveItem = _indexActiveItem%length;
                if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
                    nextItem = position.getItemMin();
                    _items[nextItem].position = position.getMax() + 1;
                    _items[nextItem].transform += _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform -= _step;
            }
            if (direction === 'left') {
                _positionLeftItem--;
                _indexActiveItem = (_indexActiveItem - 1 + length)%length;

                if (_positionLeftItem < position.getMin()) {
                    nextItem = position.getItemMax();
                    _items[nextItem].position = position.getMin() - 1;
                    _items[nextItem].transform -= _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform += _step;
            }
            _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
            if(_sectionScreenshotsWidth < 881) {
                _sliderItems[_indexActiveItem%length].classList.add("first_left_slide");
                _sliderItems[(_indexActiveItem + 1)%length].classList.add("second_slide");
                _sliderItems[(_indexActiveItem + 2)%length].classList.add("third_slide");
            } else{
            _sliderItems[_indexActiveItem%length].classList.add("first_left_slide");
            _sliderItems[(_indexActiveItem + 1)%length].classList.add("second_slide");
            _sliderItems[(_indexActiveItem + 2)%length].classList.add("third_slide");
            _sliderItems[(_indexActiveItem + 3)%length].classList.add("main_slide");
            _sliderItems[(_indexActiveItem + 4)%length].classList.add("third_slide");
            _sliderItems[(_indexActiveItem + 5)%length].classList.add("second_slide");
            _sliderItems[(_indexActiveItem + 6)%length].classList.add("first_right_slide");
            }
        }

        var _cycle = function (direction) {
            if (!_config.isCycling) {
                return;
            }
            _interval = setInterval(function () {
                _transformItem(direction);
            }, _config.interval);
        }

        // обработчик события click для кнопок "назад" и "вперед"
        var _controlClick = function (e) {
            if (e.target.classList.contains('slider__control')) {
                e.preventDefault();
                var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
                _transformItem(direction);
                clearInterval(_interval);
                _cycle(_config.direction);
            }
        };

        var _setUpListeners = function () {
            // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
            _sliderControls.forEach(function (item) {
                item.addEventListener('click', _controlClick);
            });
            if (_config.pause && _config.isCycling) {
                _mainElement.addEventListener('mouseenter', function () {
                    clearInterval(_interval);
                });
                _mainElement.addEventListener('mouseleave', function () {
                    clearInterval(_interval);
                    _cycle(_config.direction);
                });
            }
            if(_sectionScreenshotsWidth < 501){
            _mainElement.addEventListener('touchstart', function (e) {
               _startX = e.changedTouches[0].clientX;
            });
            _mainElement.addEventListener('touchend', function (e) {
                var
                    _endX = e.changedTouches[0].clientX,
                    _deltaX = _endX - _startX;
                if (_deltaX > 50) {
                    _transformItem('left');
                } else if (_deltaX < -50) {
                    _transformItem('right');
                }
            });
            }
        }

        // инициализация
        _setUpListeners();
        _cycle(_config.direction);

        return {
            right: function () { // метод right
                _transformItem('right');
            },
            left: function () { // метод left
                _transformItem('left');
            },
            stop: function () { // метод stop
                _config.isCycling = false;
                clearInterval(_interval);
            },
            cycle: function () { // метод cycle
                _config.isCycling = true;
                clearInterval(_interval);
                _cycle();
            }
        }

    }
}());

var slider = multiItemSliderScreenshots('section.screenshots', {
    isCycling: true
});



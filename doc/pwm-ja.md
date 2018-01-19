# Peripherals PWM
PWMを出力します。
流せる電流はObnizによりますが、基本的に最大1Aまでです。詳しくはObnizのハードウェア仕様書を御覧ください。
PWMは6チャンネル利用可能です。
pwm0からpwm5までが利用できます。

## obniz.getpwm()
obnizが利用していないpwmモジュールを取得します。
pwmはpwm０〜pwm５の６つが利用できますが、
この関数を呼ぶことで利用中でないpwmを取得することが出来ます。

```Javascript
// Example
var pwm = obniz.getpwm();
```
もし利用できるpwmがない場合は例外が発生しプログラムは停止します。

## start(io)

pwmをnumberで指定したピンで開始します。
開始直後はパルスは出力されません。

```Javascript
// Example
var pwm = obniz.getpwm();
pwm.start(11); // start pwm. output at io11
```
## freq(frequency)

PWMの発振周波数を指定します。
パルスの幅ではなくパルスの出る間隔を規定します。
DCモーターなどでは1khzなどが一般的です。

```Javascript
// Example
var pwm = obniz.getpwm();
pwm.start(11); // start pwm. output at io11
pwm.freq(1000); // set pwm. frequency to 1khz
```
## pulse(width ms)

PWMのパルス幅をミリ秒で指定します。

```Javascript
// Example
var pwm = obniz.getpwm();
pwm.start(11); // start pwm. output at io11
pwm.freq(1000); // set pwm frequency to 1khz
pwm.pulse(0.5) // set pwm pulse 0.5msec.  so this is  50% ratio.
```
## duty(ratio)

PWMのパルス幅をデューティー比で指定します。

```Javascript
// Example
var pwm = obniz.getpwm();
pwm.start(11); // start pwm. output at io11
pwm.freq(1000); // set pwm frequency to 1khz
pwm.duty(50) // set pwm pulse witdh 50%
```
## forceWorking(true/false)

5Vで小さなDCモーターなどをPWMから使う時に、抵抗が小さいためにちょっとしたノイズなどで過電流検知してしまいなかなか動かない場合があります。
forceWorkingを指定することで過電流検知しても可能な限りリトライしPWMを継続します。
これにより小さなDCモーターでも思った通りに動かすことが出来ます。
ただ、PWMの波形が乱れるので、きれいな矩形波が出したい場合などには向かないです。
DCモーターやコイルなどの多少乱れてでも継続して動いてほしい場合に利用して下さい。

forceWorkingを指定しても過電流検知がOFFになるわけではありません。
定期的にリセットを行うので、安全性に変わりはありません。

```Javascript
// Example
var pwm = obniz.getpwm();
pwm.start(11); // start pwm. output at io11
pwm.freq(1000); // set pwm frequency to 1khz
pwm.duty(50) // set pwm pulse witdh 50%
pwm.forceWorking(true)
```
## modulate(modulation type, interval sec, data)

PWMの出力をarrayのデータにより変調します。
変調方式は以下より選べます。

1. "am"

am変調は1であれば現在の周波数によりpwmの出力をONにして、duty比50%で出力し、０のときは出力しなくなります。
信号のシンボル長も指定できます。

```Javascript
// Example
var pwm = obniz.getpwm();
pwm.start(11);   // start pwm. output at io11
pwm.freq(38000); // set pwm frequency to 38khz

// signal for room heater's remote signal
var arr = [255,0,0,0,0,0,0,255,255,254,1,192,62,3,255,254,3,192,63,255,192,60,3,224,62,3,255,254,3,255,254,3,224,62,3,224,63,255,192,63,255,224,62,3,224,62,3,224,62,3,224,62,3,240,31,3,240,31,1,240,31,1,255,255,1,240,31,1,240,31,1,248,31,129,240,31,255,248,31,129,248,15,128,248,15,255,248,15,128,248,15,128,248,15,128,252,15,255,255];

pwm.modulate("am", 0.00007, arr); // am modulate. symbol length = 70usec.
```
## end();

PWMの発振を停止します。
出力で使われていたピンは開放されて入力になります。

```Javascript
// Example
pwm.end();
```
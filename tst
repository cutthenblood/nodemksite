login as: zandrohanov
Using keyboard-interactive authentication.
Password:
Access denied
Using keyboard-interactive authentication.
Password:
Access denied
Using keyboard-interactive authentication.
Password:
login as: zandrohanov
Using keyboard-interactive authentication.
Password:

2951-Medkubani#show config
Using 20163 out of 262136 bytes
!
! Last configuration change at 15:52:30 MSK Mon Jun 30 2014 by avasilenko
! NVRAM config last updated at 15:58:46 MSK Mon Jun 30 2014 by avasilenko
! NVRAM config last updated at 15:58:46 MSK Mon Jun 30 2014 by avasilenko
version 15.2
service timestamps debug datetime msec
service timestamps log datetime msec
service password-encryption
!
hostname 2951-Medkubani
!
boot-start-marker
boot system flash0 c2951-universalk9-mz.spa.152-4.m4.bin
boot-end-marker
!
!
!
aaa new-model
!
!
aaa accounting exec default start-stop group tacacs+
aaa accounting commands 0 default start-stop group tacacs+
aaa accounting commands 1 default start-stop group tacacs+
aaa accounting commands 15 default start-stop group tacacs+
!
!
!
!
!
aaa session-id common
clock timezone MSK 4 0
!
!
crypto pki trustpoint TP-self-signed-1447166010
 enrollment selfsigned
 subject-name cn=IOS-Self-Signed-Certificate-1447166010
 revocation-check none
 rsakeypair TP-self-signed-1447166010
!
!
crypto pki certificate chain TP-self-signed-1447166010
 certificate self-signed 01 nvram:IOS-Self-Sig#2.cer
ip cef
!
!
!
ip dhcp excluded-address 10.46.2.60 10.46.2.254
!
ip dhcp pool voice_vlan
 network 10.46.2.0 255.255.255.0
 default-router 10.46.2.254
 option 150 ip 10.46.2.254
 dns-server 10.46.1.10
 lease infinite
!
!
!
ip flow-cache timeout inactive 45
ip flow-cache timeout active 5
no ip domain lookup
ip domain name krasnodar.ru
ip name-server 85.175.46.122
ip name-server 85.175.46.130
ip inspect tcp reassembly queue length 512
ip inspect name firewall dns timeout 30
ip inspect name firewall esmtp
ip inspect name firewall ftp
ip inspect name firewall ftps
ip inspect name firewall h323
ip inspect name firewall https
ip inspect name firewall icmp
ip inspect name firewall ntp
ip inspect name firewall ssh
ip inspect name firewall isakmp
ip inspect name firewall l2tp
ip inspect name firewall pop3
ip inspect name firewall pptp
ip inspect name firewall pop3s
ip inspect name firewall igmpv3lite
ip inspect name firewall ipsec-msft
ip inspect name firewall tcp
ip inspect name firewall udp
ip inspect name firewall lotusnote
ip inspect name firewall lotusmtap
ip inspect name firewall http
no ipv6 cef
!
multilink bundle-name authenticated
!
!
!
!
!
!
trunk group MED
 hunt-scheme random
!
voice-card 0
 dsp services dspfarm
!
!
!
voice service voip
 ip address trusted list
  ipv4 10.46.1.0 255.255.255.0
  ipv4 10.2.0.0 255.255.0.0
  ipv4 192.168.0.0 255.255.0.0
 allow-connections h323 to h323
 allow-connections h323 to sip
 allow-connections sip to h323
 allow-connections sip to sip
 supplementary-service h450.12
 redirect ip2ip
 fax protocol t38 version 0 ls-redundancy 0 hs-redundancy 0 fallback none
 h323
 sip
  registrar server
!
voice class codec 2
 codec preference 1 g711alaw
 codec preference 2 g711ulaw
!
!
!
!
voice translation-rule 1
 rule 1 /^9\(.*\)/ /\1/
!
voice translation-rule 3
 rule 1 /^0\(.*\)/ /\1/
!
voice translation-rule 4
 rule 1 /^9925261/ /141/
 rule 2 /^9925188/ /112/
 rule 3 /^9925193/ /101/
 rule 4 /^9925259/ /191/
 rule 5 /^9925207/ /192/
 rule 6 /^9925255/ /193/
 rule 7 /^9925254/ /194/
 rule 8 /^9925264/ /195/
!
voice translation-rule 5
 rule 1 /^9\(.*\)/ /\1/
!
!
voice translation-profile Incoming_Calls
 translate called 4
!
voice translation-profile Remove7
 translate called 3
!
voice translation-profile Remove9
 translate called 1
!
!
!
license udi pid CISCO2951/K9 sn FCZ1744703T
license boot module c2951 technology-package securityk9
license boot module c2951 technology-package uck9
hw-module pvdm 0/0
!
!
!
archive
 log config
  hidekeys
file privilege 0
dial-control-mib retain-timer 10080
dial-control-mib max-size 1000
username AVASILENKO privilege 15 secret 5 $1$Eqnq$tqr6xmMqe8VABvqcMD.wE.
username zandrohanov privilege 15 secret 4 B3zZd3eij0MBIl71ry7L..RyakHb3Tx6YRRBtu9HgX2
!
redundancy
!
!
!
!
!
ip ssh authentication-retries 2
!
!
crypto isakmp policy 10
 encr aes 256
 authentication pre-share
 group 2
crypto isakmp key ghjdthrfcdzpb address 0.0.0.0         no-xauth
!
!
crypto ipsec transform-set AES-SHA esp-aes esp-sha-hmac
 mode tunnel
crypto ipsec df-bit clear
!
crypto ipsec profile VPN-DMVPN
 set transform-set AES-SHA
!
!
!
!
!
!
!
interface Tunnel1
 description DMVPN connection to Center Office
 bandwidth 1000
 ip address 10.253.1.20 255.255.255.0
 no ip redirects
 ip mtu 1400
 ip flow ingress
 ip flow egress
 ip nhrp authentication quick
 ip nhrp map 10.253.1.1 194.154.77.42
 ip nhrp map multicast 194.154.77.42
 ip nhrp network-id 2
 ip nhrp holdtime 3600
 ip nhrp nhs 10.253.1.1
 ip nhrp registration no-unique
 ip tcp adjust-mss 1360
 delay 1000
 qos pre-classify
 tunnel source GigabitEthernet0/1
 tunnel mode gre multipoint
 tunnel key 7001
 tunnel path-mtu-discovery
 tunnel protection ipsec profile VPN-DMVPN shared
!
interface Embedded-Service-Engine0/0
 no ip address
 shutdown
!
interface GigabitEthernet0/0
 no ip address
 ip flow ingress
 ip flow egress
 duplex auto
 speed auto
!
interface GigabitEthernet0/0.10
 description VLAN Data
 encapsulation dot1Q 1 native
 ip address 10.46.1.254 255.255.255.0
 ip flow ingress
 ip flow egress
 ip nat inside
 ip virtual-reassembly in
!
interface GigabitEthernet0/0.20
 description VLAN Phones
 encapsulation dot1Q 20
 ip address 10.46.2.254 255.255.255.0
 ip flow ingress
 ip flow egress
 ip nat inside
 ip virtual-reassembly in
 h323-gateway voip interface
 h323-gateway voip bind srcaddr 10.46.2.254
!
interface GigabitEthernet0/0.111
 encapsulation dot1Q 111
 ip address 192.168.127.101 255.255.255.0
!
interface GigabitEthernet0/1
 ip address 83.239.76.58 255.255.255.252
 ip access-group From_Internet in
 ip flow ingress
 ip flow egress
 ip nat outside
 ip inspect firewall out
 ip virtual-reassembly in
 duplex auto
 speed auto
!
interface GigabitEthernet0/2
 no ip address
 ip flow ingress
 ip flow egress
 shutdown
 duplex auto
 speed auto
!
ip forward-protocol nd
!
ip http server
ip http secure-server
ip flow-export version 5
ip flow-export destination 10.2.2.20 9996
!
ip nat inside source list For_Nat interface GigabitEthernet0/1 overload
ip nat inside source static udp 10.46.1.201 2046 interface GigabitEthernet0/1 2046
ip nat inside source static udp 10.46.1.201 55777 interface GigabitEthernet0/1 55777
ip nat inside source static tcp 10.46.1.211 22 interface GigabitEthernet0/1 2222
ip nat inside source static tcp 10.46.1.210 80 interface GigabitEthernet0/1 80
ip route 0.0.0.0 0.0.0.0 83.239.76.57
ip route 10.0.9.0 255.255.255.0 10.46.1.201
ip route 10.2.2.0 255.255.255.0 10.253.1.1
ip route 10.2.7.0 255.255.255.0 10.253.1.1
ip route 10.2.253.0 255.255.255.0 10.253.1.1
ip route 192.168.60.0 255.255.255.255 192.168.127.1
ip route 192.168.60.5 255.255.255.255 192.168.127.1
ip route 192.168.60.7 255.255.255.255 192.168.127.1
!
ip access-list extended For_Nat
 deny   ip 10.46.2.0 0.0.0.255 192.168.0.0 0.0.255.255
 permit ip 10.46.1.0 0.0.0.255 any
ip access-list extended From_Internal
 permit ip 10.46.0.0 0.0.255.255 host 10.2.2.20
 permit ip 10.46.0.0 0.0.255.255 host 10.2.7.8
 deny   ip 10.46.0.0 0.0.255.255 10.0.0.0 0.255.255.255
 permit ip 10.46.0.0 0.0.255.255 any
ip access-list extended From_Internet
 permit icmp any host 83.239.76.58 echo
 permit icmp any host 83.239.76.58 echo-reply
 permit icmp any host 83.239.76.58 time-exceeded
 permit icmp any any packet-too-big
 permit icmp any host 83.239.76.58 unreachable
 permit udp any eq isakmp host 83.239.76.58 eq isakmp
 permit esp any host 83.239.76.58
 permit gre any host 83.239.76.58
 permit udp any any eq domain
 permit tcp any any eq domain
 permit udp any host 83.239.76.58 eq 2046
 permit udp any host 83.239.76.58 eq 55777
 permit tcp any host 83.239.76.58 eq www
 permit tcp any host 83.239.76.58 eq 2222
 permit tcp any any eq smtp
 permit tcp any any eq pop3
 permit tcp any eq domain any
 permit udp any eq domain any
 permit tcp 212.33.11.0 0.0.0.255 host 83.239.76.58 eq 22
 deny   ip 10.0.0.0 0.255.255.255 any
 deny   ip 172.16.0.0 0.15.255.255 any
 deny   ip 192.168.0.0 0.0.255.255 any
 deny   ip 127.0.0.0 0.255.255.255 any
 deny   ip host 0.0.0.0 any
 deny   ip host 255.255.255.255 any
 deny   ip any host 83.239.76.58
 deny   ip any any
!
logging source-interface GigabitEthernet0/0
!
nls resp-timeout 1
cpd cr-id 1
!
snmp-server ifindex persist
snmp-server enable traps entity-sensor threshold
tftp-server flash0:SCCP69xx.9-2-1-0.loads
tacacs-server host 10.2.2.20
!
!
!
control-plane
!
!
voice-port 0/0/0
 cptone RU
 description -Fax129-
 bearer-cap Speech
!
voice-port 0/0/1
 cptone RU
 description -Fax126-
 bearer-cap Speech
!
voice-port 0/0/2
 cptone RU
 description -Fax127-
 bearer-cap Speech
!
voice-port 0/0/3
 cptone RU
 description -Fax128-
 bearer-cap Speech
!
voice-port 0/1/0
!
voice-port 0/1/1
!
voice-port 0/1/2
!
voice-port 0/1/3
 !
 !
 !
!
!
!
mgcp profile default
!
sccp ccm 10.46.2.254 identifier 1 priority 1 version 7.0
!
sccp ccm group 1
 bind interface GigabitEthernet0/0.20
 associate ccm 1 priority 1
 associate profile 1 register mtpe4c722bbebe0
 keepalive retries 5
!
dspfarm profile 1 transcode
 codec g711ulaw
 codec g711alaw
 codec g729ar8
 codec g729abr8
 maximum sessions 5
 associate application SCCP
!
dial-peer voice 1 pots
 description Fax 129
 destination-pattern 129
 port 0/0/0
!
dial-peer voice 2 pots
 description Fax 126
 destination-pattern 126
 port 0/0/1
!
dial-peer voice 3 pots
 description Fax 127
 destination-pattern 127
 port 0/0/2
!
dial-peer voice 4 pots
 description Fax 128
 destination-pattern 128
 port 0/0/3
!
dial-peer voice 5 pots
 incoming called-number .
 direct-inward-dial
 port 0/1/0
!
dial-peer voice 6 pots
 incoming called-number .
 direct-inward-dial
 port 0/1/1
!
dial-peer voice 7 pots
 incoming called-number .
 direct-inward-dial
!
dial-peer voice 8 pots
 incoming called-number .
 direct-inward-dial
!
dial-peer voice 12 voip
 description SIP_Rostelekom
 translation-profile incoming Incoming_Calls
 huntstop
 destination-pattern .T
 session protocol sipv2
 session target ipv4:192.168.60.5
 voice-class codec 2
 fax rate 9600
 fax protocol pass-through g711ulaw
 no vad
!
dial-peer voice 13 voip
 description Krasnodar_Local_SIP
 translation-profile outgoing Remove9
 destination-pattern 9[1-7,9]......
 session protocol sipv2
 session target ipv4:192.168.60.5
 voice-class codec 2
 dtmf-relay rtp-nte cisco-rtp sip-notify
 fax protocol pass-through g711ulaw
 clid network-number 9925193
 no vad
!
dial-peer voice 14 voip
 description National_SIP
 translation-profile outgoing Remove9
 destination-pattern 98[0,2-9].........
 session protocol sipv2
 session target ipv4:192.168.60.5
 voice-class codec 2
 dtmf-relay rtp-nte cisco-rtp sip-notify
 fax protocol pass-through g711ulaw
 clid network-number 9925193
 no vad
!
!
!
!
gatekeeper
 shutdown
!
!
telephony-service
 sdspfarm units 1
 sdspfarm transcode sessions 30
 sdspfarm tag 1 mtpe4c722bbebe0
 video
 max-ephones 150
 max-dn 200
 ip source-address 10.46.2.254 port 2000
 service phone videoCapability 1
 url services http://xmlphones.appspot.com/
 cnf-file location flash:
 cnf-file perphone
 user-locale RU
 network-locale RU
 load 6921 SCCP69xx.9-2-1-0.loads
 load 6941 SCCP69xx.9-2-1-0.loads
 time-zone 34
 time-format 24
 date-format dd-mm-yy
 max-conferences 8 gain -6
 call-forward pattern .T
 moh "music-on-hold.au"
 multicast moh 239.1.1.2 port 2000 route 10.46.2.254
 web admin system name root password s2pwm403co
 dn-webedit
 time-webedit
 transfer-system full-consult
 transfer-pattern .T
 transfer-pattern ...
 secondary-dialtone 9
 directory entry 1 101 name EIFadeeva
 directory entry 2 102 name YIBagdonavichute
 directory entry 3 103 name EUSinolicina
 directory entry 4 104 name VVKiyanichenko
 directory entry 5 105 name KVHarchenko
 directory entry 6 106 name EAPonomareva
 directory entry 7 107 name MASergeeva
 directory entry 8 108 name SADeynega
 directory entry 9 109 name EIUshakova
 directory entry 10 110 name DVOrobinskiy
 directory entry 11 111 name NAGubrieva
 directory entry 12 112 name ZAAndrohanov
 directory entry 13 113 name OOAnistratova
 directory entry 14 114 name EAShvidko
 directory entry 15 115 name VKMartidi
 directory entry 16 116 name NGUshkova
 directory entry 17 117 name TVNehoroshkina
 directory entry 18 118 name AUGagina
 directory entry 19 119 name EVViluckene
 directory entry 20 120 name SVZemlyanaya
 directory entry 21 121 name AVPopov
 directory entry 22 122 name EVChubukin
 directory entry 24 124 name EANemolyakina
 directory entry 25 125 name SANazarova
 fac standard
 create cnf-files version-stamp Jan 01 2002 00:00:00
!
!
ephone-template  1
 network-locale 1
 user-locale 1
 paging-dn 150
!
!
ephone-dn  1  dual-line
 number 101
 pickup-group 1
 label FadeevaEI(101)
 description FadeevaEI(101)
 name FadeevaEI(101)
 call-forward busy 121
 call-forward noan 121 timeout 15
!
!
ephone-dn  2  dual-line
 number 102
 pickup-group 1
 label BagdonavishuteUI(102)
 description BagdonavishuteUI(102)
 name BagdonavishuteUI(102)
!
!
ephone-dn  3  dual-line
 number 103
 pickup-group 1
 label SinolicinaEU(103)
 description SinolicinaEU(103)
 name SinolicinaEU(103)
!
!
ephone-dn  4  dual-line
 number 104
 pickup-group 1
 label KiyanichenkoVV(104)
 description KiyanichenkoVV(104)
 name KiyanichenkoVV(104)
!
!
ephone-dn  5  dual-line
 number 105
 pickup-group 1
 label HarchenkoKV(105)
 description HarchenkoKV(105)
 name HarchenkoKV(105)
!
!
ephone-dn  6  dual-line
 number 106
 pickup-group 1
 label PonomareveEA(106)
 description PonomareveEA(106)
 name PonomareveEA(106)
!
!
ephone-dn  7  dual-line
 number 107
 pickup-group 1
 label SergeeveMA(107)
 description SergeeveMA(107)
 name SergeeveMA(107)
!
!
ephone-dn  8  dual-line
 number 108
 pickup-group 1
 label DeynegaSA(108)
 description DeynegaSA(108)
 name DeynegaSA(108)
!
!
ephone-dn  9  dual-line
 number 109
 pickup-group 1
 label UshakovaEI(109)
 description UshakovaEI(109)
 name UshakovaEI(109)
!
!
ephone-dn  10  dual-line
 number 110
 pickup-group 1
 label OrobinskiyDV(110)
 description OrobinskiyDV(110)
 name OrobinskiyDV(110)
!
!
ephone-dn  11  dual-line
 number 111
 pickup-group 1
 label GubrievaNA(111)
 description GubrievaNA(111)
 name GubrievaNA(111)
!
!
ephone-dn  12  dual-line
 number 112
 pickup-group 1
 label AndrohanovZA(112)
 description AndrohanovZA(112)
 name AndrohanovZA(112)
!
!
ephone-dn  13  dual-line
 number 113
 pickup-group 1
 label AnistratovaOO(113)
 description AnistratovaOO(113)
 name AnistratovaOO(113)
!
!
ephone-dn  14  dual-line
 number 114
 pickup-group 1
 label ShvidkoEA(114)
 description ShvidkoEA(114)
 name ShvidkoEA(114)
!
!
ephone-dn  15  dual-line
 number 115
 pickup-group 1
 label MartidiVK(115)
 description MartidiVK(115)
 name MartidiVK(115)
!
!
ephone-dn  16  dual-line
 number 116
 pickup-group 1
 label UshkovaNG(116)
 description UshkovaNG(116)
 name UshkovaNG(116)
!
!
ephone-dn  17  dual-line
 number 117
 pickup-group 1
 label 117
 description 117
 name 117
!
!
ephone-dn  18  dual-line
 number 118
 pickup-group 1
 label GrinAU(118)
 description GrinAU(118)
 name GrinAU(118)
!
!
ephone-dn  19  dual-line
 number 119
 pickup-group 1
 label ASPalchik(119)
 description ASPalchik(119)
 name ASPalchik(119)
!
!
ephone-dn  20  dual-line
 number 120
 pickup-group 1
 label ZemlyanayaSV(120)
 description ZemlyanayaSV(120)
 name ZemlyanayaSV(120)
!
!
ephone-dn  21  dual-line
 number 121
 pickup-group 1
 label PopovAV(121)
 description PopovAV(121)
 name PopovAV(121)
!
!
ephone-dn  22  dual-line
 number 122
 pickup-group 1
 label ChubukinEV(122)
 description ChubukinEV(122)
 name ChubukinEV(122)
!
!
ephone-dn  23  dual-line
 number 123
 pickup-group 1
 label abcd1
 description abcde1
 name abc1
!
!
ephone-dn  24  dual-line
 number 124
 pickup-group 1
 label LVSharipova(124)
 description LVSharipova(124)
 name LVSharipova(124)
!
!
ephone-dn  25  dual-line
 number 125
 pickup-group 1
 label NazarovaSA(125)
 description NazarovaSA(125)
 name NazarovaSA(125)
!
!
ephone-dn  41  dual-line
 number 141
 pickup-group 1
 label 141
 description 141
 name 141
!
!
ephone-dn  90
 number 190
 description from_992-51-93
 call-forward noan 129 timeout 15
!
!
ephone-dn  91
 number 191
 description from_992-52-59
 call-forward noan 126 timeout 15
!
!
ephone-dn  92
 number 192
 description from_992-52-07
 call-forward noan 127 timeout 15
!
!
ephone-dn  93
 number 193
 description from_992-52-55
 call-forward noan 127 timeout 10
!
!
ephone-dn  94
 number 194
 description from_992-52-54
!
!
ephone-dn  95
 number 195
 description from_992-52-64
!
!
ephone-dn  150
 number 199
 paging ip 239.0.1.20 port 2000
!
!
ephone  1
 device-security-mode none
 mac-address 5006.04FB.2972
 ephone-template 1
 type 6921
 button  1:1 2:90
!
!
!
ephone  2
 device-security-mode none
 mac-address 5006.04FB.28C8
 ephone-template 1
 type 6921
 button  1:2 2:94
!
!
!
ephone  3
 device-security-mode none
 mac-address 5006.04FB.294C
 ephone-template 1
 type 6921
 button  1:3 2:94
!
!
!
ephone  4
 device-security-mode none
 mac-address 5006.04FB.2953
 ephone-template 1
 type 6921
 button  1:4 2:94
!
!
!
ephone  5
 device-security-mode none
 mac-address 5006.04FB.2C66
 ephone-template 1
 type 6921
 button  1:5 2:94
!
!
!
ephone  6
 device-security-mode none
 mac-address 5006.04FB.2A41
 ephone-template 1
 type 6921
 button  1:6 2:91
!
!
!
ephone  7
 device-security-mode none
 mac-address 5006.04FB.29AC
 ephone-template 1
 type 6921
 button  1:7 2:91
!
!
!
ephone  8
 device-security-mode none
 mac-address 5006.04FB.2866
 ephone-template 1
 type 6921
 button  1:8 2:91
!
!
!
ephone  9
 device-security-mode none
 mac-address 5006.04FB.2A0D
 ephone-template 1
 type 6921
 button  1:9 2:92
!
!
!
ephone  10
 device-security-mode none
 mac-address 5006.04FB.2C48
 ephone-template 1
 type 6921
 button  1:10 2:95
!
!
!
ephone  11
 device-security-mode none
 mac-address 5006.04FB.29FC
 ephone-template 1
 type 6921
 button  1:11
!
!
!
ephone  12
 device-security-mode none
 mac-address 5006.04FB.1EDA
 ephone-template 1
 speed-dial 1 89883408322 label "mobile"
 type 6921
 button  1:12
!
!
!
ephone  13
 device-security-mode none
 mac-address 5006.04FB.26C7
 ephone-template 1
 type 6921
 button  1:13 2:92
!
!
!
ephone  14
 device-security-mode none
 mac-address 5006.04FB.2C35
 ephone-template 1
 type 6921
 button  1:14 2:95
!
!
!
ephone  15
 device-security-mode none
 mac-address 5006.04FB.2C85
 ephone-template 1
 type 6921
 button  1:15 2:92
!
!
!
ephone  16
 device-security-mode none
 mac-address 5006.04FB.2C97
 ephone-template 1
 type 6921
 button  1:16
!
!
!
ephone  17
 device-security-mode none
 mac-address 5006.04FB.2933
 ephone-template 1
 type 6921
 button  1:17
!
!
!
ephone  18
 device-security-mode none
 mac-address 5006.04FB.2701
 ephone-template 1
 type 6921
 button  1:18
!
!
!
ephone  19
 device-security-mode none
 mac-address 5006.04FB.26B7
 ephone-template 1
 type 6921
 button  1:19 2:93
!
!
!
ephone  20
 device-security-mode none
 mac-address 5006.04FA.D7EE
 ephone-template 1
 type 6921
 button  1:20
!
!
!
ephone  21
 device-security-mode none
 mac-address 5006.04FB.23BA
 ephone-template 1
 type 6921
 button  1:21 2:93
!
!
!
ephone  22
 device-security-mode none
 mac-address 5006.04FB.2672
 ephone-template 1
 type 6921
 button  1:22 2:93
!
!
!
ephone  23
 device-security-mode none
 mac-address 5006.04FB.2100
 ephone-template 1
 type 6921
 button  1:23
!
!
!
ephone  24
 device-security-mode none
 mac-address 5006.04FB.1F2E
 ephone-template 1
 type 6921
 button  1:24 2:93
!
!
!
ephone  25
 device-security-mode none
 mac-address 5006.04FB.218D
 ephone-template 1
 type 6921
 button  1:25 2:93
!
!
!
ephone  41
 device-security-mode none
 mac-address E02A.823A.6A0B
 ephone-template 1
 username "vav" password 12345
 type CIPC
 button  1:41
!
!
!
!
line con 0
 privilege level 15
 logging synchronous
line aux 0
line 2
 no activation-character
 no exec
 transport preferred none
 transport output pad telnet rlogin lapb-ta mop udptn v120 ssh
 stopbits 1
line vty 0 4
 privilege level 15
 logging synchronous
 transport input ssh
line vty 5 15
 privilege level 15
 logging synchronous
 transport input ssh
!
scheduler allocate 20000 1000
ntp server 10.46.1.10
!
end

2951-Medkubani#   rquj5rxn8e

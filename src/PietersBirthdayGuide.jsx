import React, { useState, useEffect, useRef } from 'react';

const PietersBirthdayGuide = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const inputRef = useRef(null);

  const steps = [
    {
      type: 'intro',
      title: '# Hey Pieter',
      subtitle: '## 27 years of being awesome',
      content: 'Nice to have you in my life.',
      photo: '/photo.png',
    },
    {
      type: 'story',
      title: '# Deze is voor jou',
      content: 'Elke dag doen, we storyworthy.',
      subContent: 'Dus hierbij iets cringe maar ook wel iets moois met optionality',
    },
    {
      type: 'story',
      title: '# Het cadeau',
      content: 'Het is zo een digitaal foto boek, maar dan met de sommige one day zinnen',
      subContent: 'Raspberry Pi + Screen + Two Buttons + Our Stories',
    },
    {
      type: 'parts',
      title: '# Parts List',
      subtitle: '## Click links to add to Amazon basket',
      items: [
        {
          name: 'Raspberry Pi Zero 2 WH',
          qty: '1x',
          note: 'Pre-soldered headers, quad-core ARM Cortex-A53 @ 1GHz, 512MB RAM',
          url: 'https://www.amazon.com/Raspberry-Pi-Zero-2-WH/dp/B0DB2JBD9C'
        },
        {
          name: 'Samsung EVO Plus 32GB microSD',
          qty: '1x',
          note: 'Class 10, UHS-I, up to 130MB/s read',
          url: 'https://www.amazon.com/dp/B09B1HMJ9Z'
        },
        {
          name: 'Waveshare 2.13" e-Paper HAT V4',
          qty: '1x',
          note: '250x122 resolution, SPI interface, partial refresh 0.3s',
          url: 'https://www.amazon.com/waveshare-2-13inch-HAT-Compatible-Resolution/dp/B071S8HT76'
        },
        {
          name: 'Tactile Push Buttons (6mm)',
          qty: '2x',
          note: 'Breadboard-friendly, normally open',
          url: 'https://www.amazon.com/Momentary-Tactile-Breadboard-Friendly-QTEATAK/dp/B0815WDS4D'
        },
        {
          name: 'Female-to-Female Jumper Wires',
          qty: '1x',
          note: 'Dupont 2.54mm, you only need 4 wires',
          url: 'https://www.amazon.com/Elegoo-EL-CP-004-Multicolored-Breadboard-arduino/dp/B01EV70C78'
        },
        {
          name: '5V 3A Micro USB Power Supply',
          qty: '1x',
          note: 'With on/off switch, UL certified',
          url: 'https://www.amazon.com/NorthPada-Raspberry-Supply-Charger-Adapter/dp/B01N336XEU'
        }
      ]
    },
    {
      type: 'setup',
      title: '# Step 1: Flash the SD Card (over naar het engels)',
      sections: [
        {
          subtitle: '## Download Raspberry Pi Imager',
          commands: [
            '# macOS',
            'brew install --cask raspberry-pi-imager',
            '',
            '# Linux',
            'sudo apt install rpi-imager',
            '',
            '# Or download: https://raspberrypi.com/software/'
          ]
        },
        {
          subtitle: '## Flash the OS',
          steps: [
            'Insert microSD card into your computer',
            'Open Raspberry Pi Imager',
            'Choose OS -> Raspberry Pi OS (other) -> Raspberry Pi OS Lite (32-bit)',
            'Choose Storage -> Select your microSD card',
            'Click gear icon for advanced options:'
          ]
        },
        {
          subtitle: '## Configure (gear icon)',
          config: [
            { key: 'hostname', value: 'memorypi.local' },
            { key: 'Enable SSH', value: 'Use password authentication' },
            { key: 'username', value: 'pi' },
            { key: 'password', value: '<choose something secure>' },
            { key: 'Configure WiFi', value: 'Enter your SSID + password' },
            { key: 'WiFi country', value: 'NL' },
          ]
        }
      ]
    },
    {
      type: 'gpio',
      title: '# Step 2: GPIO Pinout Reference',
      content: 'The Pi Zero 2 W has 40 GPIO pins. We use BCM numbering.',
      diagram: `   3V3  (1)  (2)  5V
 GPIO2  (3)  (4)  5V
 GPIO3  (5)  (6)  GND
 GPIO4  (7)  (8)  GPIO14
   GND  (9)  (10) GPIO15
GPIO17  (11) (12) GPIO18
GPIO27  (13) (14) GND
GPIO22  (15) (16) GPIO23
   3V3  (17) (18) GPIO24
GPIO10  (19) (20) GND
 GPIO9  (21) (22) GPIO25
GPIO11  (23) (24) GPIO8
   GND  (25) (26) GPIO7
 GPIO0  (27) (28) GPIO1
 GPIO5  (29) (30) GND       <-- BTN1
 GPIO6  (31) (32) GPIO12    <-- BTN2
GPIO13  (33) (34) GND       <-- BTN2 GND
GPIO19  (35) (36) GPIO16
GPIO26  (37) (38) GPIO20
   GND  (39) (40) GPIO21`,
      notes: [
        'GPIOs are 3.3V - NEVER connect 5V directly!',
        'We use internal pull-up resistors in software',
        'Buttons connect GPIO to GND when pressed',
      ]
    },
    {
      type: 'wiring',
      title: '# Step 3: Wire the Buttons',
      content: 'Each button needs 2 wires: signal + ground',
      connections: [
        {
          component: 'Button 1 (Previous)',
          wires: [
            { from: 'Leg A', to: 'GPIO5 (pin 29)', color: 'yellow' },
            { from: 'Leg B', to: 'GND (pin 30)', color: 'black' },
          ]
        },
        {
          component: 'Button 2 (Next)',
          wires: [
            { from: 'Leg A', to: 'GPIO6 (pin 31)', color: 'green' },
            { from: 'Leg B', to: 'GND (pin 34)', color: 'black' },
          ]
        }
      ],
      warning: 'Tactile buttons have 4 legs connected in pairs. Use legs from OPPOSITE sides.',
    },
    {
      type: 'display',
      title: '# Step 4: Attach e-Paper HAT',
      steps: [
        'Power off the Pi (unplug USB)',
        'Align HAT pins with GPIO header',
        'Pin 1 (3.3V) should match the square pad',
        'Press down firmly until seated',
      ],
      notes: [
        'HAT uses SPI: MOSI(10), SCLK(11), CE0(8)',
        'Also: RST(17), DC(25), BUSY(24)',
        'No extra wiring needed for display',
      ]
    },
    {
      type: 'ssh',
      title: '# Step 5: First Boot & SSH',
      sections: [
        {
          subtitle: '## Boot the Pi',
          steps: [
            'Insert flashed microSD into Pi',
            'Connect USB power to PWR port',
            'Wait 60-90 seconds for boot',
          ]
        },
        {
          subtitle: '## Connect via SSH',
          commands: [
            'ssh pi@memorypi.local',
            '',
            '# If hostname fails, find IP:',
            'arp -a | grep -i "b8:27:b0"',
          ]
        }
      ]
    },
    {
      type: 'dependencies',
      title: '# Step 6: Install Dependencies',
      commands: [
        '# Update system',
        'sudo apt update && sudo apt upgrade -y',
        '',
        '# Enable SPI',
        'sudo raspi-config nonint do_spi 0',
        '',
        '# Python deps',
        'sudo apt install -y python3-pip python3-pil python3-numpy',
        '',
        '# e-Paper library',
        'git clone https://github.com/waveshare/e-Paper.git',
        'cd e-Paper/RaspberryPi_JetsonNano/python',
        'sudo pip3 install .',
        '',
        '# GPIO',
        'sudo apt install -y python3-rpi.gpio',
      ]
    },
    {
      type: 'code',
      title: '# Step 7: The Code',
      subtitle: '## Save as ~/memory_viewer.py',
    },
    {
      type: 'memories',
      title: '# Step 8: Add Memories',
      commands: [
        '# Create memories file',
        'nano ~/memories.txt',
        '',
        '# One memory per line:',
        '2024-01-15: First coffee at that weird place',
        '2024-02-03: You made me laugh so hard',
        '2024-03-22: Road trip to nowhere',
        '...',
        '',
        '# Save: Ctrl+O, Enter, Ctrl+X',
      ]
    },
    {
      type: 'service',
      title: '# Step 9: Auto-start on Boot',
      commands: [
        'sudo nano /etc/systemd/system/memory-viewer.service',
      ],
      config: `[Unit]
Description=Memory Viewer
After=multi-user.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi
ExecStart=/usr/bin/python3 /home/pi/memory_viewer.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target`,
      postCommands: [
        '',
        '# Enable service',
        'sudo systemctl daemon-reload',
        'sudo systemctl enable memory-viewer.service',
        'sudo systemctl start memory-viewer.service',
      ]
    },
    {
      type: 'install',
      title: '# Bonus: Claude Code',
      subtitle: '## For tinkering',
      commands: [
        'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -',
        'sudo apt-get install -y nodejs',
        'npm install -g @anthropic-ai/claude-code',
        'claude',
      ]
    },
    {
      type: 'finale',
      title: '# Happy 27th',
      content: 'Op nog veel zinnen samen',
      signature: '-- Jasper',
    }
  ];

  const totalSteps = steps.length;
  const step = steps[currentStep];

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'l' || e.key === 'L') {
        nextStep();
      } else if (e.key === 'h' || e.key === 'H') {
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const Line = ({ num, children, highlight, dim, indent = 0 }) => (
    <div className="flex">
      <span className="w-8 text-right pr-4 text-gray-600 select-none flex-shrink-0">{num}</span>
      <span
        className={`flex-1 whitespace-pre ${highlight ? 'text-rose-400' : ''} ${dim ? 'text-gray-500' : 'text-gray-300'}`}
        style={{ paddingLeft: `${indent}rem` }}
      >
        {children}
      </span>
    </div>
  );

  const EmptyLine = ({ num }) => (
    <div className="flex">
      <span className="w-8 text-right pr-4 text-gray-600 select-none">{num}</span>
      <span>&nbsp;</span>
    </div>
  );

  const LinkLine = ({ num, url, children }) => (
    <div className="flex">
      <span className="w-8 text-right pr-4 text-gray-600 select-none flex-shrink-0">{num}</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 hover:underline truncate"
      >
        {children}
      </a>
    </div>
  );

  let lineNum = 1;

  return (
    <div
      className="min-h-screen bg-[#1a1b26] text-gray-300 font-mono text-sm flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        autoFocus
      />

      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-3xl mx-auto">

          {step.type === 'intro' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <Line num={lineNum++} dim>{step.subtitle}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>{step.content}</Line>
              <EmptyLine num={lineNum++} />
              {step.photo && (
                <div className="flex">
                  <span className="w-8 text-right pr-4 text-gray-600 select-none flex-shrink-0">{lineNum++}</span>
                  <img src={step.photo} alt="Pieter and Jasper" className="max-w-full max-h-64 object-contain" />
                </div>
              )}
            </div>
          )}

          {step.type === 'story' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>{step.content}</Line>
              {step.subContent && (
                <>
                  <EmptyLine num={lineNum++} />
                  <Line num={lineNum++} dim>{step.subContent}</Line>
                </>
              )}
            </div>
          )}

          {step.type === 'parts' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <Line num={lineNum++} dim>{step.subtitle}</Line>
              <EmptyLine num={lineNum++} />
              {step.items.map((item, i) => (
                <div key={i}>
                  <Line num={lineNum++}>
                    <span className="text-cyan-400">{item.qty}</span>
                    {' '}<span className="text-yellow-300">{item.name}</span>
                  </Line>
                  <Line num={lineNum++} dim indent={1}>{item.note}</Line>
                  <LinkLine num={lineNum++} url={item.url}>{item.url}</LinkLine>
                  <EmptyLine num={lineNum++} />
                </div>
              ))}
            </div>
          )}

          {step.type === 'setup' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              {step.sections.map((section, i) => (
                <div key={i}>
                  <Line num={lineNum++} dim>{section.subtitle}</Line>
                  <EmptyLine num={lineNum++} />
                  {section.commands && section.commands.map((cmd, j) => (
                    <Line key={j} num={lineNum++}>
                      {cmd.startsWith('#') ? <span className="text-gray-500">{cmd}</span>
                        : cmd === '' ? <span>&nbsp;</span>
                        : <><span className="text-green-400">$</span> {cmd}</>}
                    </Line>
                  ))}
                  {section.steps && section.steps.map((s, j) => (
                    <Line key={j} num={lineNum++}>
                      <span className="text-cyan-400">{j + 1}.</span> {s}
                    </Line>
                  ))}
                  {section.config && section.config.map((cfg, j) => (
                    <Line key={j} num={lineNum++}>
                      <span className="text-yellow-400">{cfg.key}:</span>
                      {' '}<span className="text-green-300">{cfg.value}</span>
                    </Line>
                  ))}
                  <EmptyLine num={lineNum++} />
                </div>
              ))}
            </div>
          )}

          {step.type === 'gpio' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>{step.content}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++} dim>```</Line>
              {step.diagram.split('\n').map((line, i) => (
                <Line key={i} num={lineNum++}>
                  {line.includes('<--') ? (
                    <><span className="text-gray-500">{line.split('<--')[0]}</span><span className="text-yellow-400">{'<--'}{line.split('<--')[1]}</span></>
                  ) : <span className="text-gray-500">{line}</span>}
                </Line>
              ))}
              <Line num={lineNum++} dim>```</Line>
              <EmptyLine num={lineNum++} />
              {step.notes.map((note, i) => (
                <Line key={i} num={lineNum++}><span className="text-yellow-400">*</span> {note}</Line>
              ))}
            </div>
          )}

          {step.type === 'wiring' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>{step.content}</Line>
              <EmptyLine num={lineNum++} />
              {step.connections.map((conn, i) => (
                <div key={i}>
                  <Line num={lineNum++} dim>## {conn.component}</Line>
                  {conn.wires.map((wire, j) => (
                    <Line key={j} num={lineNum++}>
                      <span className={wire.color === 'yellow' ? 'text-yellow-400' : wire.color === 'green' ? 'text-green-400' : 'text-gray-400'}>{wire.from}</span>
                      {' -> '}
                      <span className="text-cyan-400">{wire.to}</span>
                      {' '}<span className="text-gray-600">({wire.color})</span>
                    </Line>
                  ))}
                  <EmptyLine num={lineNum++} />
                </div>
              ))}
              <Line num={lineNum++}><span className="text-rose-400">NOTE:</span> {step.warning}</Line>
            </div>
          )}

          {step.type === 'display' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              {step.steps.map((s, i) => (
                <Line key={i} num={lineNum++}><span className="text-cyan-400">{i + 1}.</span> {s}</Line>
              ))}
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++} dim>## Technical notes:</Line>
              {step.notes.map((note, i) => (
                <Line key={i} num={lineNum++}><span className="text-yellow-400">*</span> {note}</Line>
              ))}
            </div>
          )}

          {step.type === 'ssh' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              {step.sections.map((section, i) => (
                <div key={i}>
                  <Line num={lineNum++} dim>{section.subtitle}</Line>
                  <EmptyLine num={lineNum++} />
                  {section.steps && section.steps.map((s, j) => (
                    <Line key={j} num={lineNum++}><span className="text-cyan-400">{j + 1}.</span> {s}</Line>
                  ))}
                  {section.commands && section.commands.map((cmd, j) => (
                    <Line key={j} num={lineNum++}>
                      {cmd.startsWith('#') ? <span className="text-gray-500">{cmd}</span>
                        : cmd === '' ? <span>&nbsp;</span>
                        : <><span className="text-green-400">$</span> {cmd}</>}
                    </Line>
                  ))}
                  <EmptyLine num={lineNum++} />
                </div>
              ))}
            </div>
          )}

          {step.type === 'dependencies' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              {step.commands.map((cmd, i) => (
                <Line key={i} num={lineNum++}>
                  {cmd.startsWith('#') ? <span className="text-gray-500">{cmd}</span>
                    : cmd === '' ? <span>&nbsp;</span>
                    : <><span className="text-green-400">$</span> {cmd}</>}
                </Line>
              ))}
            </div>
          )}

          {step.type === 'code' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <Line num={lineNum++} dim>{step.subtitle}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++} dim>```python</Line>
              <Line num={lineNum++}><span className="text-purple-400">#!/usr/bin/env python3</span></Line>
              <Line num={lineNum++}><span className="text-purple-400">import</span> time</Line>
              <Line num={lineNum++}><span className="text-purple-400">from</span> waveshare_epd <span className="text-purple-400">import</span> epd2in13_V4</Line>
              <Line num={lineNum++}><span className="text-purple-400">from</span> PIL <span className="text-purple-400">import</span> Image, ImageDraw, ImageFont</Line>
              <Line num={lineNum++}><span className="text-purple-400">import</span> RPi.GPIO <span className="text-purple-400">as</span> GPIO</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>BTN_PREV = <span className="text-cyan-400">5</span>  <span className="text-gray-500"># pin 29</span></Line>
              <Line num={lineNum++}>BTN_NEXT = <span className="text-cyan-400">6</span>  <span className="text-gray-500"># pin 31</span></Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}><span className="text-purple-400">with</span> <span className="text-green-400">open</span>(<span className="text-yellow-400">'/home/pi/memories.txt'</span>) <span className="text-purple-400">as</span> f:</Line>
              <Line num={lineNum++}>    memories = [l.strip() <span className="text-purple-400">for</span> l <span className="text-purple-400">in</span> f <span className="text-purple-400">if</span> l.strip()]</Line>
              <Line num={lineNum++}>current = <span className="text-cyan-400">0</span></Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>epd = epd2in13_V4.EPD()</Line>
              <Line num={lineNum++}>epd.init()</Line>
              <Line num={lineNum++}>font = ImageFont.truetype(<span className="text-yellow-400">'/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'</span>, <span className="text-cyan-400">12</span>)</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}><span className="text-purple-400">def</span> <span className="text-blue-400">show</span>(idx):</Line>
              <Line num={lineNum++}>    img = Image.new(<span className="text-yellow-400">'1'</span>, (epd.height, epd.width), <span className="text-cyan-400">255</span>)</Line>
              <Line num={lineNum++}>    draw = ImageDraw.Draw(img)</Line>
              <Line num={lineNum++}>    draw.text((<span className="text-cyan-400">5</span>,<span className="text-cyan-400">5</span>), f<span className="text-yellow-400">"[{'{'}idx+1{'}'}/{'{'}len(memories){'}'}]"</span>, font=font, fill=<span className="text-cyan-400">0</span>)</Line>
              <Line num={lineNum++}>    draw.text((<span className="text-cyan-400">5</span>,<span className="text-cyan-400">25</span>), memories[idx][:<span className="text-cyan-400">40</span>], font=font, fill=<span className="text-cyan-400">0</span>)</Line>
              <Line num={lineNum++}>    <span className="text-purple-400">if</span> <span className="text-green-400">len</span>(memories[idx]) {'>'} <span className="text-cyan-400">40</span>:</Line>
              <Line num={lineNum++}>        draw.text((<span className="text-cyan-400">5</span>,<span className="text-cyan-400">45</span>), memories[idx][<span className="text-cyan-400">40</span>:<span className="text-cyan-400">80</span>], font=font, fill=<span className="text-cyan-400">0</span>)</Line>
              <Line num={lineNum++}>    epd.display(epd.getbuffer(img))</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>GPIO.setmode(GPIO.BCM)</Line>
              <Line num={lineNum++}>GPIO.setup(BTN_PREV, GPIO.IN, pull_up_down=GPIO.PUD_UP)</Line>
              <Line num={lineNum++}>GPIO.setup(BTN_NEXT, GPIO.IN, pull_up_down=GPIO.PUD_UP)</Line>
              <Line num={lineNum++}>show(current)</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}><span className="text-purple-400">while</span> <span className="text-cyan-400">True</span>:</Line>
              <Line num={lineNum++}>    <span className="text-purple-400">if not</span> GPIO.input(BTN_PREV) <span className="text-purple-400">and</span> current {'>'} <span className="text-cyan-400">0</span>:</Line>
              <Line num={lineNum++}>        current -= <span className="text-cyan-400">1</span>; show(current); time.sleep(<span className="text-cyan-400">0.3</span>)</Line>
              <Line num={lineNum++}>    <span className="text-purple-400">if not</span> GPIO.input(BTN_NEXT) <span className="text-purple-400">and</span> current {'<'} <span className="text-green-400">len</span>(memories)-<span className="text-cyan-400">1</span>:</Line>
              <Line num={lineNum++}>        current += <span className="text-cyan-400">1</span>; show(current); time.sleep(<span className="text-cyan-400">0.3</span>)</Line>
              <Line num={lineNum++}>    time.sleep(<span className="text-cyan-400">0.1</span>)</Line>
              <Line num={lineNum++} dim>```</Line>
            </div>
          )}

          {step.type === 'memories' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              {step.commands.map((cmd, i) => (
                <Line key={i} num={lineNum++}>
                  {cmd.startsWith('#') ? <span className="text-gray-500">{cmd}</span>
                    : cmd === '' ? <span>&nbsp;</span>
                    : cmd.startsWith('2024') || cmd === '...' ? <span className="text-yellow-400">{cmd}</span>
                    : <><span className="text-green-400">$</span> {cmd}</>}
                </Line>
              ))}
            </div>
          )}

          {step.type === 'service' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              {step.commands.map((cmd, i) => (
                <Line key={i} num={lineNum++}><span className="text-green-400">$</span> {cmd}</Line>
              ))}
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++} dim>```ini</Line>
              {step.config.split('\n').map((line, i) => (
                <Line key={i} num={lineNum++}>
                  {line.startsWith('[') ? <span className="text-cyan-400">{line}</span>
                    : line.includes('=') ? <><span className="text-yellow-400">{line.split('=')[0]}</span>=<span className="text-green-300">{line.split('=')[1]}</span></>
                    : <span>&nbsp;</span>}
                </Line>
              ))}
              <Line num={lineNum++} dim>```</Line>
              {step.postCommands.map((cmd, i) => (
                <Line key={i} num={lineNum++}>
                  {cmd.startsWith('#') ? <span className="text-gray-500">{cmd}</span>
                    : cmd === '' ? <span>&nbsp;</span>
                    : <><span className="text-green-400">$</span> {cmd}</>}
                </Line>
              ))}
            </div>
          )}

          {step.type === 'install' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <Line num={lineNum++} dim>{step.subtitle}</Line>
              <EmptyLine num={lineNum++} />
              {step.commands.map((cmd, i) => (
                <Line key={i} num={lineNum++}><span className="text-green-400">$</span> {cmd}</Line>
              ))}
            </div>
          )}

          {step.type === 'finale' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>{step.content}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++} dim>{step.signature}</Line>
            </div>
          )}

        </div>
      </div>

      <div className="bg-[#16161e] border-t border-gray-800 px-4 py-2 flex justify-between items-center text-xs">
        <span className="text-gray-500">
          <span className="text-rose-400">h</span>/<span className="text-rose-400">l</span> to navigate
        </span>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">[{currentStep + 1}/{totalSteps}]</span>
          <span className="text-cyan-400">birthday.md</span>
          <span className="text-green-400">main</span>
        </div>
      </div>
    </div>
  );
};

export default PietersBirthdayGuide;

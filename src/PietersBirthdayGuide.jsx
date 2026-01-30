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
      title: '# A Gift for You',
      content: 'Every day, we write down the most memorable thing we experienced. One sentence. One moment. Captured forever.',
      subContent: 'I wanted to give you something special — something you can build with your hands, something that holds our memories.',
    },
    {
      type: 'story',
      title: '# What You\'re Building',
      content: 'A memory machine. A small device that displays our daily sentences, one at a time. Press forward, press back, relive the moments.',
      subContent: 'Raspberry Pi + Screen + Two Buttons + Our Stories',
    },
    {
      type: 'parts',
      title: '# Parts List',
      items: [
        { name: 'Raspberry Pi Zero 2 W', qty: '1x', note: 'The brain' },
        { name: 'MicroSD Card (16GB+)', qty: '1x', note: 'Pre-loaded with memories' },
        { name: 'Waveshare 2.13" e-Paper HAT', qty: '1x', note: 'The display' },
        { name: 'Tactile Push Buttons', qty: '2x', note: '<- and ->' },
        { name: 'Micro USB Cable', qty: '1x', note: 'Power' },
        { name: 'Jumper Wires (F-F)', qty: '4x', note: 'Connections' },
        { name: 'USB Power Adapter', qty: '1x', note: '5V/2A' }
      ]
    },
    {
      type: 'assembly',
      title: '# Step 1: Connect the Display',
      instruction: 'Align the e-Paper HAT with the GPIO pins on the Raspberry Pi Zero 2 W',
      detail: 'Gently press down until fully seated',
    },
    {
      type: 'assembly',
      title: '# Step 2: Wire the Buttons',
      instruction: 'Connect the buttons using jumper wires:',
      wiring: [
        { from: 'Button 1 (<-)', to: 'GPIO 5 + GND' },
        { from: 'Button 2 (->)', to: 'GPIO 6 + GND' }
      ],
    },
    {
      type: 'assembly',
      title: '# Step 3: Insert the SD Card',
      instruction: 'Slide the microSD card into the slot on the Pi',
      detail: 'The card is pre-loaded with the operating system and our memories',
    },
    {
      type: 'assembly',
      title: '# Step 4: Power On',
      instruction: 'Connect the micro USB cable to power',
      detail: 'Wait 30 seconds for the first memory to appear',
    },
    {
      type: 'code',
      title: '# The Code',
      subtitle: "Already on your SD card, but here's how it works",
    },
    {
      type: 'install',
      title: '# Install Claude Code',
      subtitle: 'For when you want to tinker',
      steps: [
        'ssh pi@raspberrypi.local',
        'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -',
        'sudo apt-get install -y nodejs',
        'npm install -g @anthropic-ai/claude-code',
        'claude',
      ]
    },
    {
      type: 'finale',
      title: '# Happy 27th',
      content: "Here's to more sentences, more memories, more adventures together.",
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

  const Line = ({ num, children, highlight, dim }) => (
    <div className="flex">
      <span className="w-8 text-right pr-4 text-gray-600 select-none flex-shrink-0">{num}</span>
      <span className={`flex-1 ${highlight ? 'text-rose-400' : ''} ${dim ? 'text-gray-500' : 'text-gray-300'}`}>
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

  let lineNum = 1;

  return (
    <div
      className="min-h-screen bg-[#1a1b26] text-gray-300 font-mono text-sm flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden input for capturing keystrokes on mobile */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none"
        autoFocus
      />

      {/* Main content */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-2xl mx-auto">

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
                  <img
                    src={step.photo}
                    alt="Pieter and Jasper"
                    className="max-w-full max-h-64 object-contain"
                  />
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
              <EmptyLine num={lineNum++} />
              {step.items.map((item, i) => (
                <div key={i}>
                  <Line num={lineNum++}>
                    <span className="text-cyan-400">{item.qty}</span>
                    {' '}{item.name}
                    <span className="text-gray-500"> -- {item.note}</span>
                  </Line>
                </div>
              ))}
            </div>
          )}

          {step.type === 'assembly' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>{step.instruction}</Line>
              {step.detail && (
                <>
                  <EmptyLine num={lineNum++} />
                  <Line num={lineNum++} dim>{step.detail}</Line>
                </>
              )}
              {step.wiring && (
                <>
                  <EmptyLine num={lineNum++} />
                  {step.wiring.map((wire, i) => (
                    <Line key={i} num={lineNum++}>
                      <span className="text-yellow-400">{wire.from}</span>
                      {' -> '}
                      <span className="text-green-400">{wire.to}</span>
                    </Line>
                  ))}
                </>
              )}
            </div>
          )}

          {step.type === 'code' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <Line num={lineNum++} dim>{step.subtitle}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++} dim>```python</Line>
              <Line num={lineNum++}><span className="text-purple-400">import</span> time</Line>
              <Line num={lineNum++}><span className="text-purple-400">from</span> waveshare_epd <span className="text-purple-400">import</span> epd2in13_V4</Line>
              <Line num={lineNum++}><span className="text-purple-400">from</span> PIL <span className="text-purple-400">import</span> Image, ImageDraw, ImageFont</Line>
              <Line num={lineNum++}><span className="text-purple-400">import</span> RPi.GPIO <span className="text-purple-400">as</span> GPIO</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>BTN_PREV, BTN_NEXT = <span className="text-cyan-400">5</span>, <span className="text-cyan-400">6</span></Line>
              <Line num={lineNum++}>memories = <span className="text-green-400">open</span>(<span className="text-yellow-400">'memories.txt'</span>).readlines()</Line>
              <Line num={lineNum++}>current = <span className="text-cyan-400">0</span></Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}><span className="text-purple-400">def</span> <span className="text-blue-400">display</span>(text):</Line>
              <Line num={lineNum++}>    image = Image.new(<span className="text-yellow-400">'1'</span>, (<span className="text-cyan-400">250</span>, <span className="text-cyan-400">122</span>), <span className="text-cyan-400">255</span>)</Line>
              <Line num={lineNum++}>    draw = ImageDraw.Draw(image)</Line>
              <Line num={lineNum++}>    draw.text((<span className="text-cyan-400">10</span>, <span className="text-cyan-400">50</span>), text, fill=<span className="text-cyan-400">0</span>)</Line>
              <Line num={lineNum++}>    epd.display(epd.getbuffer(image))</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}>GPIO.setup([BTN_PREV, BTN_NEXT], GPIO.IN)</Line>
              <Line num={lineNum++}>epd = epd2in13_V4.EPD()</Line>
              <Line num={lineNum++}>epd.init()</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++}><span className="text-purple-400">while</span> <span className="text-cyan-400">True</span>:</Line>
              <Line num={lineNum++}>    <span className="text-purple-400">if not</span> GPIO.input(BTN_PREV): current = max(<span className="text-cyan-400">0</span>, current-<span className="text-cyan-400">1</span>)</Line>
              <Line num={lineNum++}>    <span className="text-purple-400">if not</span> GPIO.input(BTN_NEXT): current = min(len(memories)-<span className="text-cyan-400">1</span>, current+<span className="text-cyan-400">1</span>)</Line>
              <Line num={lineNum++}>    display(memories[current])</Line>
              <Line num={lineNum++}>    time.sleep(<span className="text-cyan-400">0.2</span>)</Line>
              <Line num={lineNum++} dim>```</Line>
            </div>
          )}

          {step.type === 'install' && (
            <div>
              <Line num={lineNum++} highlight>{step.title}</Line>
              <Line num={lineNum++} dim>{step.subtitle}</Line>
              <EmptyLine num={lineNum++} />
              <Line num={lineNum++} dim>```bash</Line>
              {step.steps.map((s, i) => (
                <Line key={i} num={lineNum++}>
                  <span className="text-green-400">$</span> {s}
                </Line>
              ))}
              <Line num={lineNum++} dim>```</Line>
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

      {/* Status bar */}
      <div className="bg-[#16161e] border-t border-gray-800 px-4 py-2 flex justify-between items-center text-xs">
        <div className="flex items-center gap-4">
          <span className="text-gray-500">
            use <span className="text-rose-400">h</span>/<span className="text-rose-400">l</span> to navigate
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">
            [{currentStep + 1}/{totalSteps}]
          </span>
          <span className="text-cyan-400">
            birthday.md
          </span>
          <span className="text-green-400">
            main
          </span>
        </div>
      </div>
    </div>
  );
};

export default PietersBirthdayGuide;

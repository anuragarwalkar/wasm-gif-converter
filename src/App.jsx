import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [gif, setGif] = useState();
  const [video, setVideo] = useState();

  const load = () => {
    ffmpeg.load().then(() => setReady(true));
  };

  const convertToGif = async () => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );
    const data = ffmpeg.FS('readFile', 'out.gif');
    // create
    const url = URL.createObjectURL(new Blob([data.buffer]), {
      type: 'image/gif',
    });
    setGif(url);
  };

  useEffect(load, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          margin: '50px 0',
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 0.5,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h3>Select you video file to convert</h3>
          <div>
            <input
              type="file"
              onChange={({
                target: {
                  files: [file],
                },
              }) => {
                setVideo(file);
              }}
            />
          </div>
          <div style={{ margin: '10px' }}>
            {video && (
              <video
                controls
                width={250}
                src={URL.createObjectURL(video)}
              ></video>
            )}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flex: 0.5,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h3>Result</h3>
          {gif && <img src={gif} width={250} />}
        </div>
      </div>
      <button onClick={convertToGif} disabled={!ready}>
        Convert
      </button>
    </div>
  );
}

export default App;

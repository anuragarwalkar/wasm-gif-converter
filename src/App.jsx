import React, { useState, useEffect } from 'react';
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
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif' ,'out.gif');
    const data = ffmpeg.FS('readFile', 'out.gif');
    // create
    const url = URL.createObjectURL(new Blob([data.buffer]), {type: 'image/gif'})
    setGif(url);
  }

  useEffect(load, []);

  return (
    <div
      style={{
        margin: '50px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>Select you video file to convert</div>
      <div>
        <input type="file" onChange={({ target: { files: [file] } } ) => {setVideo(file)}} />
      </div>
      <div style={{margin: '10px'}}>
        {video && <video controls width={250} src={URL.createObjectURL(video)}>
          </video>}
      </div>
      <h3>Result</h3>
      <button onClick={convertToGif} disabled={!ready}>Convert</button>
      {gif && <img src={gif} width={250} />}
    </div>
  );
}

export default App;

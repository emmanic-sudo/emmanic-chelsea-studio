import { useState, useEffect, useRef } from "react";

// Chelsea players (current + legends)
const chelseaPlayers = [
  "Frank Lampard", "John Terry", "Petr Čech", "Didier Drogba",
  "Eden Hazard", "Gianfranco Zola", "Claude Makélélé", "Jimmy Floyd Hasselbaink",
  "Mason Mount", "Reece James", "Thiago Silva", "Enzo Fernandez",
  "Kai Havertz", "Christian Pulisic", "N'Golo Kanté", "Marc Cucurella"
];

// Mapping players to profile pics
const chelseaPlayersImages = {
  "Frank Lampard": "https://upload.wikimedia.org/wikipedia/commons/5/51/Frank_Lampard_2014.jpg",
  "John Terry": "https://upload.wikimedia.org/wikipedia/commons/8/8b/John_Terry_2012.jpg",
  "Petr Čech": "https://upload.wikimedia.org/wikipedia/commons/4/4b/Petr_Cech_2010.jpg",
  "Didier Drogba": "https://upload.wikimedia.org/wikipedia/commons/2/21/Didier_Drogba_2012.jpg",
  "Eden Hazard": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Eden_Hazard_2018.jpg",
  "Gianfranco Zola": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Gianfranco_Zola_2010.jpg",
  "Claude Makélélé": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Claude_Makelele.jpg",
  "Jimmy Floyd Hasselbaink": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Jimmy_Floyd_Hasselbaink.jpg",
  "Mason Mount": "https://upload.wikimedia.org/wikipedia/commons/4/43/Mason_Mount_2021.jpg",
  "Reece James": "https://upload.wikimedia.org/wikipedia/commons/8/87/Reece_James_2022.jpg",
  "Thiago Silva": "https://upload.wikimedia.org/wikipedia/commons/9/99/Thiago_Silva_2019.jpg",
  "Enzo Fernandez": "https://upload.wikimedia.org/wikipedia/commons/2/24/Enzo_Fernandez_2022.jpg",
  "Kai Havertz": "https://upload.wikimedia.org/wikipedia/commons/7/73/Kai_Havertz_2021.jpg",
  "Christian Pulisic": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Christian_Pulisic_2021.jpg",
  "N'Golo Kanté": "https://upload.wikimedia.org/wikipedia/commons/7/7f/N%27Golo_Kant%C3%A9_2018.jpg",
  "Marc Cucurella": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Marc_Cucurella_2022.jpg"
};

// Firework particle creation
function createFireworkParticles(x, y, color) {
  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 4 + 2,
      life: 100,
      color
    });
  }
  return particles;
}

function OnlineStudio() {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [taggedPlayer, setTaggedPlayer] = useState(chelseaPlayers[0]);
  const [filterPlayer, setFilterPlayer] = useState(null);
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Fireworks canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const newParticles = [...particles];
      newParticles.forEach((p, i) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;
        ctx.fillStyle = p.color || `hsl(${p.life * 3},100%,60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) newParticles.splice(i, 1);
      });

      setParticles(newParticles);
      requestAnimationFrame(animate);
    }

    animate();

    const handleClick = (e) => {
      const newF = createFireworkParticles(e.clientX, e.clientY, '#00AEEF');
      setParticles(prev => [...prev, ...newF]);
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [particles]);

  // Add a new post
  const addPost = () => {
    if (!image) return;
    const newPost = {
      id: Date.now(),
      image: URL.createObjectURL(image),
      caption,
      player: taggedPlayer,
      comments: []
    };
    setPosts([newPost, ...posts]);
    setImage(null);
    setCaption("");

    // Fireworks burst for new post
    const burst = createFireworkParticles(window.innerWidth / 2, 200, '#FFD700');
    setParticles(prev => [...prev, ...burst]);
  };

  // Add anonymous comment
  const addComment = (id, text) => {
    setPosts(posts.map(p => p.id === id ? { ...p, comments: [...p.comments, text] } : p));
  };

  const displayedPosts = filterPlayer ? posts.filter(p => p.player === filterPlayer) : posts;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0A1E4B', color: 'white', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: -10 }} />

      {/* Sidebar */}
      <div style={{ width: '220px', padding: '1rem', overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
        <h2 style={{ textAlign: 'center', color: '#00AEEF' }}>Chelsea Players</h2>
        {chelseaPlayers.map(p => (
          <div
            key={p}
            style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', cursor: 'pointer', backgroundColor: filterPlayer === p ? '#034694' : 'transparent', borderRadius: '0.3rem', padding: '0.2rem' }}
            onClick={() => setFilterPlayer(filterPlayer === p ? null : p)}
          >
            <img src={chelseaPlayersImages[p]} alt={p} style={{ width: '35px', height: '35px', borderRadius: '50%', marginRight: '0.5rem' }} />
            <span>{p}</span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#00AEEF' }}>
          ⚡ Emmanic Chelsea Studio
        </h1>

        {/* Post creation */}
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} style={{ width: '100%' }} />
          <input type="text" placeholder="Lifestyle caption..." value={caption} onChange={e => setCaption(e.target.value)} style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }} />

          <select value={taggedPlayer} onChange={e => setTaggedPlayer(e.target.value)} style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }}>
            {chelseaPlayers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <button onClick={addPost} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#034694', color: 'white', border: 'none', borderRadius: '0.3rem' }}>
            Post Story
          </button>
        </div>

        {/* Posts */}
        {displayedPosts.map(post => (
          <div key={post.id} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
            <img src={post.image} style={{ width: '100%', borderRadius: '1rem' }} />
            <p>{post.caption}</p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
              <img src={chelseaPlayersImages[post.player]} alt={post.player} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '0.5rem' }} />
              <p style={{ fontWeight: 'bold', color: '#FFD700', margin: 0 }}>Tagged: {post.player}</p>
            </div>
            <AnonymousComments post={post} onComment={addComment} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Anonymous comment component
function AnonymousComments({ post, onComment }) {
  const [text, setText] = useState("");

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <p style={{ fontWeight: 'bold' }}>💬 Anonymous Sparks</p>
      {post.comments.map((c, i) => <p key={i} style={{ fontSize: '0.9rem' }}>✨ {c}</p>)}
      <input type="text" placeholder="Comment anonymously..." value={text} onChange={e => setText(e.target.value)} style={{ width: '100%', marginTop: '0.25rem', padding: '0.25rem' }} />
      <button style={{ marginTop: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: '#00AEEF', color: 'white', border: 'none', borderRadius: '0.2rem' }} onClick={() => { onComment(post.id, text); setText(""); }}>
        Spark
      </button>
    </div>
  );
}

export default OnlineStudio;
  

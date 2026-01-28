import { useState, useEffect, useRef } from "react";

// List of Chelsea players (current + legends)
const chelseaPlayers = [
  "Frank Lampard", "John Terry", "Petr Čech", "Didier Drogba",
  "Eden Hazard", "Gianfranco Zola", "Claude Makélélé", "Jimmy Floyd Hasselbaink",
  "Mason Mount", "Reece James", "Thiago Silva", "Enzo Fernandez",
  "Kai Havertz", "Christian Pulisic", "N'Golo Kanté", "Marc Cucurella"
];

function OnlineStudio() {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [taggedPlayer, setTaggedPlayer] = useState(chelseaPlayers[0]);
  const canvasRef = useRef(null);

  // Fireworks effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    function createFirework(x, y) {
      for (let i = 0; i < 60; i++) {
        particles.push({
          x, y,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 4 + 2,
          life: 100
        });
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;
        ctx.fillStyle = `hsl(${p.life * 3}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      });

      requestAnimationFrame(animate);
    }

    animate();
    canvas.addEventListener("click", e => createFirework(e.clientX, e.clientY));
    return () => canvas.removeEventListener("click", () => {});
  }, []);

  // Add a post
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
  };

  // Add anonymous comment
  const addComment = (id, text) => {
    setPosts(posts.map(p => p.id === id ? { ...p, comments: [...p.comments, text] } : p));
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#0A1E4B', color: 'white', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: -10 }} />

      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#00AEEF' }}>
          ⚡ Emmanic Chelsea Studio
        </h1>

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

        {posts.map(post => (
          <div key={post.id} style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
            <img src={post.image} style={{ width: '100%', borderRadius: '1rem' }} />
            <p>{post.caption}</p>
            <p style={{ fontWeight: 'bold', color: '#FFD700' }}>Tagged: {post.player}</p>
            <AnonymousComments post={post} onComment={addComment} />
          </div>
        ))}
      </div>
    </div>
  );
}

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
                                                   

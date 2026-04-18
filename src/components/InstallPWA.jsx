import { useState, useEffect } from 'react';

export default function InstallPWA() {
  const [prompt, setPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setVisible(false);
    setPrompt(null);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-wikya-blue text-white rounded-2xl shadow-2xl p-4 z-50 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        <img src="/assets/wikya-icon.png" alt="Wikya" className="w-7 h-7 object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">Installer Wikya</p>
        <p className="text-xs text-blue-200 mt-0.5">Accès rapide depuis votre écran d'accueil</p>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          onClick={handleInstall}
          className="bg-wikya-orange text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-wikya-orange-dark transition-colors"
        >
          Installer
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-blue-300 text-xs text-center hover:text-white transition-colors"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

interface WorkspaceHubProps {
  workspaceToken: string | null;
}

export default function WorkspaceHub({ workspaceToken }: WorkspaceHubProps) {
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [formsFiles, setFormsFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pickerUrl, setPickerUrl] = useState('');

  useEffect(() => {
    if (!workspaceToken) return;
    
    const fetchDriveData = async () => {
      setLoading(true);
      try {
        // Fetch 5 recent Drive files
        const resDrive = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=5&orderBy=modifiedTime desc', {
          headers: { Authorization: `Bearer ${workspaceToken}` },
        });
        const driveData = await resDrive.json();
        if (driveData.files) {
          setDriveFiles(driveData.files);
        }

        // Fetch 5 recent Google Forms using Drive API
        const resForms = await fetch("https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.form'&pageSize=5", {
          headers: { Authorization: `Bearer ${workspaceToken}` },
        });
        const formsData = await resForms.json();
        if (formsData.files) {
          setFormsFiles(formsData.files);
        }
      } catch (err) {
        console.error("Failed to fetch Workspace data", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDriveData();
  }, [workspaceToken]);

  return (
    <div className="w-full max-w-lg mx-auto pb-32 animate-fade-in relative z-10 px-5">
      <h1 className="font-display text-3xl font-extrabold text-white tracking-tight mb-2 mt-4 text-center">
        Workspace Integrations
      </h1>
      <p className="text-center text-indigo-200/70 text-sm mb-10">Access your Google Drive & Forms</p>

      {!workspaceToken ? (
        <div className="glass-panel p-6 rounded-3xl text-center">
          <p className="text-white/60 mb-4">You need to sign in with Google to access Workspace features.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Custom File Picker UI Built with Drive API */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-display text-lg font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400">folder_open</span>
              Drive File Picker
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Select a file below to import it into i-FLEC for analysis.
            </p>
            <div className="max-h-64 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {loading ? (
                <p className="text-white/50 text-sm text-center py-4">Loading your Drive...</p>
              ) : driveFiles.length > 0 ? (
                driveFiles.map((f: any) => (
                  <div key={f.id} onClick={() => setPickerUrl(f.id)} className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${pickerUrl === f.id ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                       <span className="material-symbols-outlined text-indigo-300">
                         {f.mimeType === 'application/vnd.google-apps.document' ? 'description' : 
                          f.mimeType === 'application/vnd.google-apps.spreadsheet' ? 'table' :
                          f.mimeType === 'application/vnd.google-apps.presentation' ? 'slideshow' : 'insert_drive_file'}
                       </span>
                       <span className="truncate text-sm font-medium text-white/90">{f.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/50 text-sm text-center">No files found.</p>
              )}
            </div>
            
            {pickerUrl && (
              <button 
                onClick={() => alert(`File ${pickerUrl} ready for processing!`)}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:scale-[0.99] active:scale-[0.98]">
                 <span className="material-symbols-outlined">auto_awesome</span>
                 Process Selected File
              </button>
            )}
          </div>

          {/* Drive Recent Files */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400">add_to_drive</span>
              Recent Drive Files
            </h3>
            {loading ? (
               <p className="text-white/50 text-sm text-center py-4">Loading files...</p>
            ) : driveFiles.length > 0 ? (
               <ul className="space-y-2">
                 {driveFiles.map((f: any) => (
                   <li key={f.id} className="text-sm p-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium flex truncate items-center gap-2 hover:bg-white/10 cursor-pointer transition-all">
                     <span className="material-symbols-outlined text-white/50 text-base">description</span>
                     <span className="truncate">{f.name}</span>
                   </li>
                 ))}
               </ul>
            ) : (
               <p className="text-white/50 text-sm text-center">No files found.</p>
            )}
          </div>

          {/* Forms Recent Files */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff4e7c]">list_alt</span>
              Your Google Forms
            </h3>
            {loading ? (
               <p className="text-white/50 text-sm text-center py-4">Loading forms...</p>
            ) : formsFiles.length > 0 ? (
               <ul className="space-y-2 mb-4">
                 {formsFiles.map((f: any) => (
                   <li key={f.id} className="text-sm p-3 bg-white/5 border border-white/10 rounded-lg text-white font-medium flex-col gap-2 hover:bg-white/10 cursor-pointer transition-all">
                     <div className="flex truncate items-center gap-2">
                       <span className="material-symbols-outlined text-white/50 text-base">ballot</span>
                       <span className="truncate">{f.name}</span>
                     </div>
                     <button 
                       onClick={async (e) => {
                         e.stopPropagation();
                         const res = await fetch(`https://forms.googleapis.com/v1/forms/${f.id}`, { headers: { Authorization: `Bearer ${workspaceToken}` } });
                         const data = await res.json();
                         alert(data.info ? `Form Fetched Successfully: ${data.info.title}` : 'Failed to fetch via Forms API');
                       }}
                       className="mt-2 text-xs text-[#ff4e7c] bg-[#ff4e7c]/10 px-2 py-1 rounded w-fit active:scale-95 transition-all">
                       Test Forms API
                     </button>
                   </li>
                 ))}
               </ul>
            ) : (
               <p className="text-white/50 text-sm text-center mb-4">No forms found.</p>
            )}
            
            <button 
              onClick={async () => {
                const confirmed = window.confirm("Create a new i-FLEC Evaluation form in your Google Drive?");
                if (!confirmed) return;
                try {
                  const res = await fetch("https://forms.googleapis.com/v1/forms", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${workspaceToken}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ info: { title: "i-FLEC Evaluation Form", documentTitle: "i-FLEC Survey" } })
                  });
                  const form = await res.json();
                  if (form.formId) {
                    alert(`Newly created form ID: ${form.formId}`);
                    setFormsFiles([{ id: form.formId, name: "i-FLEC Evaluation Form" }, ...formsFiles]); // optimistic update
                  } else {
                    alert("Failure to create form.");
                  }
                } catch (err) {
                  alert("Error creating form.");
                }
              }}
              className="w-full bg-[#ff4e7c]/20 hover:bg-[#ff4e7c]/30 text-[#ff4e7c] font-semibold py-3 flex items-center justify-center gap-2 rounded-xl transition-all cursor-pointer">
               <span className="material-symbols-outlined">add_task</span>
               Create New Evaluation Form
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

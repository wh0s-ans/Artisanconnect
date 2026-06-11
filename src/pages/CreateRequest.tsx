import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requests } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, ArrowLeft, Send, MapPin, Tag, Euro, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from "react-i18next";

export default function CreateRequest() {
    const { t } = useTranslation();
 const { user } = useAuth();
 const navigate = useNavigate();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');

 const [formData, setFormData] = useState({
 title: '',
 description: '',
 category: 'Plomberie',
 budget: '',
 location: '',
 city: '',
 urgency: 'normal'
 });

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!user) return;
 setLoading(true);
 setError('');

 try {
 const newReq = await requests.create({
 title: formData.title,
 description: formData.description,
 category: formData.category,
 location: formData.location,
 city: formData.city || formData.location,
 urgency: formData.urgency as 'normal' | 'urgent' | 'very_urgent',
 budget: formData.budget ? parseInt(formData.budget) : undefined,
 material_provided: false,
 is_public: true,
 });
 navigate(`/requests/${newReq.id}`);
 } catch (err: any) {
 setError(err.message || 'Erreur lors de la publication.');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-editorial-bg py-8 py-8">
 <div className="max-w-3xl mx-auto px-4">
 <button 
 onClick={() => navigate(-1)}
 className="flex items-center gap-4 text-editorial-muted hover:text-editorial-accent mb-8 lg:mb-12 transition-colors text-sm font-semibold"
 >
 <ArrowLeft className="h-4 w-4" />
 
                  {t('auto.retour')}
                  </button>

 <motion.div 
   initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
   className="bg-white rounded-xl shadow-sm border border-editorial-border rounded-lg shadow-sm overflow-hidden"
 >
 <div className="bg-editorial-accent hover:bg-editorial-accent/90 p-6 lg:p-12 text-white">
 <span className="text-sm font-semibold block mb-4 ">{t('auto.nouveau-projet')}</span>
 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold ">{t('auto.publication-dun-besoin')}</h1>
 <p className="opacity-80 mt-2 text-sm lg:text-base">{t('auto.detaillez-vos-exigences-pour-u')}</p>
 </div>

 <form onSubmit={handleSubmit} className="p-6 lg:p-12 space-y-8 lg:space-y-12">
 {error && (
 <div className="p-4 bg-red-950/30 border border-red-500/50 flex items-center gap-3 text-red-400 text-sm font-medium leading-relaxed">
 <AlertCircle className="h-4 w-4" />
 {error}
 </div>
 )}

 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">{t('auto.nature-du-projet')}</label>
 <input 
 type="text"
 required
 value={formData.title}
 onChange={(e) => setFormData({...formData, title: e.target.value})}
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors placeholder:text-editorial-muted"
 placeholder={t('auto.ex-remplacement-robinet-cuisin')}
 />
 </div>

 <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">{t('auto.discipline')}</label>
 <div className="relative">
 <select 
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors appearance-none cursor-pointer"
 value={formData.category}
 onChange={(e) => setFormData({...formData, category: e.target.value})}
 >
 <option className="bg-white rounded-xl shadow-sm" value="Plomberie">{t('auto.plomberie')}</option>
 <option className="bg-white rounded-xl shadow-sm" value="Électricité">{t('auto.electricite')}</option>
 <option className="bg-white rounded-xl shadow-sm" value="Peinture">{t('auto.peinture')}</option>
 <option className="bg-white rounded-xl shadow-sm" value="Maçonnerie">{t('auto.maconnerie')}</option>
 <option className="bg-white rounded-xl shadow-sm" value="Menuiserie">{t('auto.menuiserie')}</option>
 <option className="bg-white rounded-xl shadow-sm" value="Architecture">{t('auto.architecture')}</option>
 <option className="bg-white rounded-xl shadow-sm" value="Serrurerie">{t('auto.serrurerie')}</option>
 <option className="bg-white rounded-xl shadow-sm" value="Jardinage">{t('auto.jardinage')}</option>
 <option className="bg-white rounded-xl shadow-sm" value="Chauffage">{t('auto.chauffage')}</option>
 <option className="bg-white rounded-xl shadow-sm" value="Nettoyage">{t('auto.nettoyage')}</option>
 </select>
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">{t('auto.lieu')}</label>
 <div className="relative">
 <input 
 type="text"
 required
 value={formData.location}
 onChange={(e) => setFormData({...formData, location: e.target.value})}
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors placeholder:text-editorial-muted"
 placeholder={t('auto.ville-ou-code-postal')}
 />
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">{t('auto.descriptif-detaille')}</label>
 <textarea 
 required
 rows={4}
 value={formData.description}
 onChange={(e) => setFormData({...formData, description: e.target.value})}
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors placeholder:text-editorial-muted resize-none"
 placeholder={t('auto.materiaux-acces-delais-souhait')}
 />
 </div>

 <div className="grid sm:grid-cols-2 gap-8 lg:gap-12">
 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">{t('auto.estimation-budgetaire')}</label>
 <div className="relative">
 <input 
 type="number"
 value={formData.budget}
 onChange={(e) => setFormData({...formData, budget: e.target.value})}
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors placeholder:text-editorial-muted"
 placeholder={t('auto.montant-en-euros')}
 />
 </div>
 </div>

 <div className="space-y-4">
 <label className="text-sm text-editorial-accent font-bold">{t('auto.urgence')}</label>
 <select 
 className="w-full bg-white border border-editorial-border rounded-md py-3 px-4 text-editorial-fg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-editorial-accent transition-colors appearance-none cursor-pointer"
 value={formData.urgency}
 onChange={(e) => setFormData({...formData, urgency: e.target.value})}
 >
 <option value="normal" className="bg-white rounded-xl shadow-sm">{t('auto.standard')}</option>
 <option value="urgent" className="bg-white rounded-xl shadow-sm">{t('auto.prioritaire')}</option>
 <option value="very_urgent" className="bg-white rounded-xl shadow-sm">{t('auto.intervention-immediate')}</option>
 </select>
 </div>
 </div>

 <div className="p-6 lg:p-10 border border-editorial-border rounded-lg shadow-sm bg-editorial-bg flex gap-6 ">
 <Info className="h-5 w-5 text-editorial-accent flex-shrink-0 mt-1" />
 <p className="text-sm lg:text-sm text-editorial-muted leading-relaxed ">
 
                              {t('auto.votre-appel-doffres-sera-exclu')}
                              </p>
 </div>

 <button 
 type="submit"
 disabled={loading}
 className="w-full py-4 lg:py-6 bg-editorial-accent hover:bg-editorial-accent/90 text-white text-xs lg:text-sm font-semibold lg:tracking-[0.4em] hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-4 lg:gap-6"
 >
 {loading ? 'Instanciation...' : 'Publier mon besoin'}
 <Send className="h-4 w-4" />
 </button>
 </form>
 </motion.div>
 </div>
 </div>
 );
}

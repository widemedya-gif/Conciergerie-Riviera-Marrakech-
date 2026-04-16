import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Building, Calendar, TrendingUp, Sparkles, Shield, MessageSquare, 
  LayoutDashboard, Map, FileText, CheckCircle, Star, ArrowRight,
  BarChart3, Users, Clock, Key, Camera, Globe, ChevronRight, Wrench
} from "lucide-react";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { cn } from "@/src/lib/utils";

// --- Components ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-serif font-bold text-luxury-black dark:text-white mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-neutral-600 dark:text-neutral-400 text-lg"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="group bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 hover:border-luxury-gold/30 hover:shadow-xl transition-all duration-300"
  >
    <div className="w-14 h-14 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-luxury-gold/10 group-hover:scale-110 transition-all duration-300">
      <Icon className="w-6 h-6 text-luxury-black dark:text-white group-hover:text-luxury-gold transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-luxury-black dark:text-white mb-3">{title}</h3>
    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
      {desc}
    </p>
  </motion.div>
);

const AlternatingSection = ({ title, desc, features, imageAlign = "right", imageAspect = "video" }: any) => (
  <section className="py-20 md:py-32">
    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
      <div className={cn("flex flex-col gap-12 md:gap-20 items-center", imageAlign === "left" ? "lg:flex-row-reverse" : "lg:flex-row")}>
        <motion.div 
          initial={{ opacity: 0, x: imageAlign === "left" ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 space-y-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black dark:text-white mb-6">
              {title}
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {desc}
            </p>
          </div>
          
          {features && (
            <ul className="space-y-4">
              {features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-luxury-gold/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3 h-3 text-luxury-gold" />
                  </div>
                  <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex-1 w-full"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <ImagePlaceholder 
              src={`https://images.unsplash.com/photo-${imageAlign === "left" ? "1600596542815-ffad4c1539a9" : "1600607687931-ce8e004a8f1d"}?auto=format&fit=crop&w=1200&q=80`}
              alt={title}
              aspectRatio={imageAspect}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export function GestionImmobiliere() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-luxury-black pt-24">
      
      {/* 1. Hero Section (Bento Grid + Glassmorphism) */}
      <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-neutral-50 dark:bg-luxury-black transition-colors duration-500">
        {/* Background abstract elements for glassmorphism to pop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-luxury-gold/20 dark:bg-luxury-gold/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-400/20 dark:bg-blue-900/10 blur-[120px]" />
          <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-neutral-300/50 dark:bg-neutral-500/10 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[180px] md:auto-rows-[220px]">
            
            {/* Main Intro Box - Span 2x2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-[2rem] p-8 md:p-12 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 flex flex-col justify-center relative overflow-hidden group shadow-xl dark:shadow-2xl"
            >
              <div className="relative z-10">
                <span className="inline-block py-1.5 px-4 rounded-full bg-luxury-gold/10 dark:bg-luxury-gold/20 text-luxury-gold text-xs font-bold uppercase tracking-widest mb-6 border border-luxury-gold/20 dark:border-luxury-gold/30">
                  Service Exclusif
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-black dark:text-white mb-6 leading-tight">
                  Gestion Immobilière <span className="text-luxury-gold">Premium</span>
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8 font-light max-w-md">
                  Confiez-nous votre propriété et maximisez sa rentabilité en toute sérénité. Une gestion 100% déléguée pour les propriétaires exigeants.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-8 py-4 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-full font-bold uppercase tracking-wider transition-all text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
                    Confier mon bien
                  </button>
                  <button className="px-8 py-4 bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 backdrop-blur-md text-luxury-black dark:text-white border border-neutral-200 dark:border-white/10 rounded-full font-bold uppercase tracking-wider transition-all text-sm">
                    Consultation
                  </button>
                </div>
              </div>
              {/* Decorative background element */}
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl group-hover:bg-luxury-gold/20 transition-all duration-700" />
            </motion.div>

            {/* Image Box - Span 1x2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="col-span-1 md:col-span-1 lg:col-span-1 row-span-2 rounded-[2rem] overflow-hidden relative group shadow-xl dark:shadow-2xl border border-white/40 dark:border-white/10"
            >
              <ImagePlaceholder 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Villa"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <Map className="w-4 h-4 text-luxury-gold" />
                  <span className="text-xs text-luxury-gold font-bold uppercase tracking-wider">Maroc</span>
                </div>
                <p className="text-white font-serif text-xl">Villas & Riads d'Exception</p>
              </div>
            </motion.div>

            {/* Stat Box 1 - Span 1x1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="col-span-1 rounded-[2rem] p-6 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 flex flex-col justify-center items-center text-center group hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-xl dark:shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 dark:bg-luxury-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-luxury-gold" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-luxury-black dark:text-white mb-2">+30%</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Revenus générés</p>
            </motion.div>

            {/* Stat Box 2 - Span 1x1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="col-span-1 rounded-[2rem] p-6 bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 flex flex-col justify-center items-center text-center group hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-xl dark:shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 dark:bg-luxury-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-luxury-gold" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-luxury-black dark:text-white mb-2">4.9/5</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-medium">Note moyenne</p>
            </motion.div>

            {/* Feature Box - Span Full Width */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="col-span-1 md:col-span-3 lg:col-span-4 row-span-1 rounded-[2rem] p-6 md:p-8 bg-gradient-to-r from-luxury-gold/10 to-white/60 dark:from-luxury-gold/20 dark:to-white/5 backdrop-blur-2xl border border-luxury-gold/20 dark:border-luxury-gold/30 flex flex-col md:flex-row items-center justify-between gap-6 group shadow-xl dark:shadow-2xl"
            >
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-full bg-luxury-gold/10 dark:bg-luxury-gold/20 flex items-center justify-center shrink-0 border border-luxury-gold/20 dark:border-luxury-gold/30 group-hover:bg-luxury-gold/20 dark:group-hover:bg-luxury-gold/30 transition-colors">
                  <Shield className="w-8 h-8 text-luxury-gold" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-luxury-black dark:text-white mb-2">Tranquillité d'esprit garantie</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 text-sm md:text-base max-w-3xl">
                    De la création de l'annonce à l'accueil des voyageurs, en passant par le ménage et la maintenance, nous gérons l'intégralité du processus pour vous.
                  </p>
                </div>
              </div>
              <button className="shrink-0 w-14 h-14 rounded-full bg-white/50 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 flex items-center justify-center transition-colors border border-neutral-200 dark:border-white/20 group-hover:scale-105">
                <ArrowRight className="w-6 h-6 text-luxury-black dark:text-white" />
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. Full-Service Management Overview (Core Functionalities) */}
      <section className="py-20 md:py-32 bg-white dark:bg-neutral-900">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeader 
            title="Une Gestion Clé en Main" 
            subtitle="Nous prenons en charge chaque aspect de votre propriété pour vous offrir une tranquillité d'esprit totale."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={FileText} 
              title="Création d'Annonces" 
              desc="Photos professionnelles, descriptions optimisées et diffusion sur les meilleures plateformes."
              delay={0.1}
            />
            <FeatureCard 
              icon={Calendar} 
              title="Gestion des Réservations" 
              desc="Optimisation du calendrier, tarification dynamique et sélection rigoureuse des locataires."
              delay={0.2}
            />
            <FeatureCard 
              icon={TrendingUp} 
              title="Optimisation des Revenus" 
              desc="Stratégies de prix basées sur les données pour maximiser votre rendement locatif."
              delay={0.3}
            />
            <FeatureCard 
              icon={Sparkles} 
              title="Entretien & Ménage" 
              desc="Nettoyage professionnel entre chaque séjour et maintenance préventive régulière."
              delay={0.4}
            />
            <FeatureCard 
              icon={Shield} 
              title="Sécurité & Protection" 
              desc="Vérification d'identité, cautions gérées et assurance couverture complète."
              delay={0.5}
            />
            <FeatureCard 
              icon={MessageSquare} 
              title="Support Voyageurs 24/7" 
              desc="Communication fluide, accueil personnalisé et assistance continue pour vos invités."
              delay={0.6}
            />
            <FeatureCard 
              icon={LayoutDashboard} 
              title="Espace Propriétaire" 
              desc="Suivez vos revenus, le taux d'occupation et l'état de votre bien en temps réel."
              delay={0.7}
            />
            <FeatureCard 
              icon={Map} 
              title="Gestion Multi-Villes" 
              desc="Une expertise locale à Marrakech, Casablanca, Rabat, Tanger et Agadir."
              delay={0.8}
            />
          </div>
        </div>
      </section>

      {/* 3. Revenue Optimization Strategy */}
      <AlternatingSection 
        title="Stratégie d'Optimisation des Revenus"
        desc="Notre algorithme de tarification dynamique analyse quotidiennement les tendances du marché, la demande locale et les événements spéciaux pour ajuster vos prix. Résultat : un taux d'occupation maximisé et des revenus supérieurs à la moyenne du marché."
        features={[
          "Ajustement quotidien des prix",
          "Analyse de la concurrence locale",
          "Stratégies de séjour minimum",
          "Promotions ciblées hors saison"
        ]}
        imageAlign="right"
      />

      {/* 4. Short-Term Rental Management */}
      <AlternatingSection 
        title="Location Courte Durée Premium"
        desc="Idéal pour les villas, riads et appartements de haut standing. Nous transformons votre propriété en une destination prisée, offrant une expérience hôtelière 5 étoiles à vos locataires tout en générant des revenus exceptionnels."
        features={[
          "Expérience client sur-mesure",
          "Produits d'accueil de luxe",
          "Conciergerie intégrée pour les invités",
          "Flexibilité d'utilisation pour le propriétaire"
        ]}
        imageAlign="left"
      />

      {/* 5. Long-Term Rental Management */}
      <AlternatingSection 
        title="Location Longue Durée Sécurisée"
        desc="Pour une rentabilité stable et sans surprise. Nous sélectionnons rigoureusement les locataires, gérons les contrats, les encaissements et l'entretien, vous garantissant un revenu passif en toute sécurité."
        features={[
          "Vérification stricte des dossiers",
          "Garantie loyers impayés (optionnelle)",
          "États des lieux détaillés",
          "Gestion des relations locataires"
        ]}
        imageAlign="right"
      />

      {/* 6. Property Maintenance & Cleaning */}
      <section className="py-20 md:py-32 bg-neutral-100 dark:bg-neutral-800/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeader 
            title="Un Entretien Impeccable" 
            subtitle="Votre propriété mérite les meilleurs soins. Nos équipes dédiées assurent un standard de propreté et de maintenance digne des plus grands hôtels."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "Ménage Hôtelier", desc: "Protocoles stricts, linge de maison premium et produits écologiques." },
              { icon: Wrench, title: "Maintenance Préventive", desc: "Inspections régulières pour anticiper et éviter les réparations coûteuses." },
              { icon: Clock, title: "Interventions Rapides", desc: "Un réseau d'artisans qualifiés disponibles 24/7 pour les urgences." }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-neutral-900 p-8 rounded-3xl text-center">
                <div className="w-16 h-16 mx-auto bg-luxury-gold/10 rounded-full flex items-center justify-center mb-6">
                  <item.icon className="w-8 h-8 text-luxury-gold" />
                </div>
                <h3 className="text-xl font-bold text-luxury-black dark:text-white mb-4">{item.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Guest Experience Management */}
      <AlternatingSection 
        title="L'Expérience Voyageur au Cœur de Notre Approche"
        desc="Un voyageur satisfait est un voyageur qui revient et qui recommande. Nous offrons un accueil personnalisé, un livret d'accueil digital, et une assistance continue pour garantir des séjours inoubliables et des avis 5 étoiles."
        features={[
          "Check-in / Check-out personnalisé",
          "Livret d'accueil digital",
          "Recommandations locales",
          "Réactivité en moins de 15 minutes"
        ]}
        imageAlign="left"
      />

      {/* 8. Security & Property Protection */}
      <AlternatingSection 
        title="Sécurité et Protection de Votre Patrimoine"
        desc="Nous ne laissons rien au hasard. Chaque locataire est vérifié, des cautions sont systématiquement prises, et nous installons (avec votre accord) des capteurs de bruit et de fumée pour prévenir tout débordement."
        features={[
          "Vérification d'identité stricte",
          "Gestion des cautions automatisée",
          "Assurance dommages incluse",
          "Surveillance non-intrusive (bruit/fumée)"
        ]}
        imageAlign="right"
      />

      {/* 9. Legal & Administrative Handling */}
      <AlternatingSection 
        title="Gestion Administrative et Légale"
        desc="Libérez-vous de la paperasse. Nous gérons les contrats, la facturation, les déclarations de taxes de séjour et nous assurons que votre location respecte toutes les réglementations locales en vigueur."
        features={[
          "Rédaction des contrats de location",
          "Collecte et reversement des taxes",
          "Conformité légale",
          "Rapports comptables clairs"
        ]}
        imageAlign="left"
      />

      {/* 10. Owner Dashboard & Analytics (Mock Dashboard) */}
      <section className="py-20 md:py-32 bg-white dark:bg-luxury-black text-luxury-black dark:text-white overflow-hidden transition-colors duration-500">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Votre Espace Propriétaire</h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
              Suivez les performances de votre propriété en temps réel grâce à notre tableau de bord intuitif et transparent.
            </p>
          </div>
          
          <div className="relative mx-auto max-w-5xl">
            {/* Mock Dashboard UI */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-luxury-gold/10 dark:bg-luxury-gold/20 flex items-center justify-center">
                    <Building className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="font-bold text-luxury-black dark:text-white">Villa Majorelle</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Marrakech, Maroc</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold">En ligne</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800">
                {[
                  { label: "Revenus (Ce mois)", value: "45 000 MAD", trend: "+12%" },
                  { label: "Taux d'occupation", value: "85%", trend: "+5%" },
                  { label: "Note moyenne", value: "4.9/5", trend: "Stable" },
                  { label: "Prochaine résa.", value: "Demain", trend: "3 nuits" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-neutral-900 p-6">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold mb-1 text-luxury-black dark:text-white">{stat.value}</p>
                    <p className="text-xs text-luxury-gold">{stat.trend}</p>
                  </div>
                ))}
              </div>
              
              {/* Chart Placeholder */}
              <div className="p-8 h-64 flex items-center justify-center border-t border-neutral-200 dark:border-neutral-800">
                <div className="text-center text-neutral-400 dark:text-neutral-500 flex flex-col items-center">
                  <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                  <p>Graphique des performances interactif</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-luxury-gold/10 dark:bg-luxury-gold/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* 11. Multi-City Property Handling */}
      <AlternatingSection 
        title="Une Présence Nationale"
        desc="Que vous possédiez un riad à Marrakech, un appartement vue mer à Tanger, ou une villa à Casablanca, nos équipes locales assurent une gestion de proximité avec la même exigence de qualité."
        features={[
          "Équipes dédiées par ville",
          "Connaissance des marchés locaux",
          "Réseau de partenaires de confiance",
          "Un seul interlocuteur pour tout votre portefeuille"
        ]}
        imageAlign="right"
      />

      {/* 12. Luxury Property Specialization */}
      <AlternatingSection 
        title="Spécialistes de l'Immobilier de Prestige"
        desc="Nous comprenons les exigences uniques des propriétés de luxe. De la sélection des locataires à l'entretien des équipements spécifiques (piscines chauffées, hammams, domotique), nous offrons un service sur-mesure."
        features={[
          "Marketing ciblé clientèle haut de gamme",
          "Entretien spécialisé (piscine, jardin, domotique)",
          "Services de conciergerie inclus",
          "Discrétion et confidentialité absolues"
        ]}
        imageAlign="left"
      />

      {/* 13. Marketing & Listing Optimization */}
      <AlternatingSection 
        title="Marketing et Visibilité Maximale"
        desc="Votre propriété est mise en valeur par des photographes professionnels et diffusée sur les plateformes les plus performantes (Airbnb, Booking, Plum Guide) ainsi que sur notre réseau exclusif."
        features={[
          "Shooting photo professionnel",
          "Rédaction SEO des annonces",
          "Diffusion multi-plateformes",
          "Campagnes marketing ciblées"
        ]}
        imageAlign="right"
      />

      {/* 14. Why Choose Our Management Service */}
      <section className="py-20 md:py-32 bg-neutral-100 dark:bg-neutral-800/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeader 
            title="Pourquoi Nous Choisir ?" 
            subtitle="Plus qu'une agence, nous sommes votre partenaire de confiance pour valoriser votre patrimoine."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Transparence Totale", desc: "Pas de frais cachés, des rapports clairs et un accès 24/7 à vos données." },
              { title: "Expertise Locale", desc: "Une connaissance pointue du marché marocain et de ses spécificités." },
              { title: "Rentabilité Accrue", desc: "Nos clients voient en moyenne leurs revenus augmenter de 30%." },
              { title: "Tranquillité d'Esprit", desc: "Déléguez à 100%, nous nous occupons de tout, vraiment tout." }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-700">
                <h3 className="text-xl font-bold text-luxury-black dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-luxury-gold" />
                  {item.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. Client Testimonials */}
      <section className="py-20 md:py-32 bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeader 
            title="Ils Nous Font Confiance" 
            subtitle="Découvrez les retours d'expérience des propriétaires qui ont choisi notre service de gestion."
          />
          
          <div className="flex overflow-x-auto pb-12 -mx-6 px-6 md:mx-0 md:px-0 gap-6 snap-x snap-mandatory custom-scrollbar">
            {[
              {
                quote: "Grâce à leur gestion, mon riad à Marrakech génère des revenus constants sans que je m'en occupe. Une équipe professionnelle et réactive.",
                name: "Karim B.",
                role: "Propriétaire d'un Riad",
                location: "Marrakech"
              },
              {
                quote: "J'hésitais à mettre ma villa en location courte durée. Ils ont su me rassurer et les résultats ont dépassé mes attentes. Service impeccable.",
                name: "Sophie L.",
                role: "Propriétaire d'une Villa",
                location: "Casablanca"
              },
              {
                quote: "Le tableau de bord est un vrai plus. Je peux suivre mes revenus depuis l'étranger en toute transparence. Je recommande vivement.",
                name: "Omar T.",
                role: "Investisseur",
                location: "Tanger"
              },
              {
                quote: "Une gestion clé en main qui porte bien son nom. Je n'ai plus à me soucier des petits tracas du quotidien, tout est géré d'une main de maître.",
                name: "Amina S.",
                role: "Propriétaire d'Appartements",
                location: "Rabat"
              }
            ].map((testimonial, i) => (
              <div key={i} className="min-w-[300px] md:min-w-[400px] bg-neutral-50 dark:bg-neutral-800 p-8 rounded-3xl relative snap-center shrink-0 border border-neutral-100 dark:border-neutral-700">
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
                  ))}
                </div>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 italic mb-8">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center font-bold text-luxury-black dark:text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-black dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-500">{testimonial.role}, {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16. Pricing / Packages Overview */}
      <section className="py-20 md:py-32 bg-neutral-100 dark:bg-neutral-800/50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <SectionHeader 
            title="Une Tarification Simple et Transparente" 
            subtitle="Nous ne gagnons que si vous gagnez. Notre commission est calculée uniquement sur les revenus générés."
          />
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-700">
            <div className="p-8 md:p-12 text-center border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="text-2xl font-bold text-luxury-black dark:text-white mb-2">Gestion Complète</h3>
              <div className="flex items-end justify-center gap-1 mb-4">
                <span className="text-5xl font-bold text-luxury-gold">20%</span>
                <span className="text-neutral-500 mb-1">/ TTC</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">Commission sur les revenus locatifs nets</p>
            </div>
            <div className="p-8 md:p-12 bg-neutral-50 dark:bg-neutral-800/50">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Création et optimisation de l'annonce",
                  "Shooting photo professionnel inclus",
                  "Gestion des réservations et tarification",
                  "Check-in / Check-out physique",
                  "Ménage et blanchisserie hôtelière",
                  "Assistance voyageurs 24/7",
                  "Maintenance de premier niveau",
                  "Accès au tableau de bord propriétaire"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-luxury-gold shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 17. Call-To-Action Section (Contact Form) */}
      <section className="py-20 md:py-32 bg-neutral-50 dark:bg-luxury-black text-luxury-black dark:text-white relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none">
          <ImagePlaceholder 
            src="https://images.unsplash.com/photo-1600607687931-ce8e004a8f1d?auto=format&fit=crop&w=2000&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Prêt à maximiser vos revenus ?</h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-10">
              Parlez à l'un de nos experts en gestion immobilière. Nous évaluerons le potentiel de votre propriété gratuitement et sans engagement.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 dark:bg-luxury-gold/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Contact Direct</h4>
                  <p className="text-neutral-500 dark:text-neutral-400">+212 6 00 00 00 00</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/10 dark:bg-luxury-gold/20 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-luxury-gold" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Couverture Nationale</h4>
                  <p className="text-neutral-500 dark:text-neutral-400">Marrakech, Casablanca, Rabat, Tanger</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-2xl text-luxury-black dark:text-white border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-2xl font-bold mb-6 text-center">Estimer mon potentiel</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold outline-none" placeholder="Votre nom" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type de bien</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold outline-none">
                      <option>Villa</option>
                      <option>Appartement</option>
                      <option>Riad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Ville</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold outline-none">
                      <option>Marrakech</option>
                      <option>Casablanca</option>
                      <option>Rabat</option>
                      <option>Tanger</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-luxury-gold outline-none" placeholder="+212 6..." />
                </div>
                <button className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold/90 text-white rounded-xl font-bold uppercase tracking-wider transition-all mt-4">
                  Demander une estimation
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 md:hidden z-50">
        <button className="w-full py-3 bg-luxury-gold text-white rounded-full font-bold uppercase tracking-wider">
          Parler à un expert
        </button>
      </div>

    </div>
  );
}

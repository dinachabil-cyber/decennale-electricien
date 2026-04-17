import React from 'react';

function FeaturesSection({ content = {} }) {
  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="fade-in">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-gradient mb-6"> Assurance Décennale Électricien</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="bg-yellow-50 rounded-3xl p-8 mb-12">
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                Tout électricien qui intervient sur des travaux de construction ou de rénovation est soumis à une obligation légale claire : souscription une assurance décennale avant l'ouverture du premier chantier. Cette obligation découle directement de la loi Spinetta du 4 janvier 1978, codifiée à l'article 1792 du Code civil.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-20">
              <div className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-400/80 rounded-2xl shadow-lg">
                    <i className="fas fa-euro-sign text-white text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gradient mb-4">Prix Assurance Décennale</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Le tarif dépend de plusieurs facteurs : chiffre d'affaires, nature des chantiers, statut juridique. Les cotisations annuelles se situent entre 600 et 2 500 euros.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Auto-entrepreneur : 600-900€/an</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Artisan : 1000-2000€/an</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700">Société : Sur devis</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-400/80 rounded-2xl shadow-lg">
                    <i className="fas fa-shield-alt text-white text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gradient mb-4">Garanties Incluses</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <span className="text-gray-700">Responsabilité Civile Décennale</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <span className="text-gray-700">Dommages aux existants</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <span className="text-gray-700">RC Professionnelle</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <span className="text-gray-700">Protection 10 ans</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-400/80 rounded-2xl shadow-lg">
                    <i className="fas fa-user-clock text-white text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gradient mb-4">Auto-Entrepreneur</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Tout électricien auto-entrepreneur est soumis aux mêmes obligations légales. Le statut micro-entrepreneur n'exonère pas de l'obligation d'assurance construction.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700 text-sm">Obligation légale (loi Spinetta)</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-xs"></i>
                        </div>
                        <span className="text-gray-700 text-sm">Mentions obligatoires sur devis</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-3xl p-8 shadow-xl border border-gray-100 card-hover">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-gradient-to-br from-yellow-400 to-yellow-400/80 rounded-2xl shadow-lg">
                    <i className="fas fa-question-circle text-white text-2xl"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gradient mb-4">Que Couvre la Décennale ?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <span className="text-gray-700">Défauts d'installation électrique</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <span className="text-gray-700">Incendies d'origine électrique</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <span className="text-gray-700">Non-conformité normes NFC 15-100</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <div className="p-1 bg-yellow-400 rounded-full mt-1">
                          <i className="fas fa-check text-white text-sm"></i>
                        </div>
                        <span className="text-gray-700">Installations photovoltaïques</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-bold text-dark mb-8 text-center">Comment ça marche ?</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-dark">01</span>
                  </div>
                  <h3 className="font-bold text-dark mb-2">Remplissez le formulaire</h3>
                  <p className="text-sm text-gray-600">En 2 minutes, donnez vos informations.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-dark">02</span>
                  </div>
                  <h3 className="font-bold text-dark mb-2">Analyse de votre profil</h3>
                  <p className="text-sm text-gray-600">Nos experts analysent votre situation.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-dark">03</span>
                  </div>
                  <h3 className="font-bold text-dark mb-2">Comparez les offres</h3>
                  <p className="text-sm text-gray-600">Recevez plusieurs devis personnalisés.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-dark">04</span>
                  </div>
                  <h3 className="font-bold text-dark mb-2">Souscrivez</h3>
                  <p className="text-sm text-gray-600">Choisissez et recevez votre attestation.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 scanlines-bg opacity-10"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-white/40 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <i className="fas fa-calculator text-3xl text-dark"></i>
                </div>
                <h2 className="text-4xl font-bold mb-6 text-dark">Devis assurance décennale électricien</h2>
                <p className="text-xl mb-8 text-dark/90 max-w-3xl mx-auto leading-relaxed">
                  Pour obtenir un devis d'assurance décennale électricien, complétez le formulaire en haut de page. Nos experts vous orientent vers les meilleures garanties adaptées à votre activité.
                </p>
                <a href="#contactForm" className="inline-block bg-dark text-yellow-400 font-bold py-4 px-10 rounded-2xl hover:bg-primary transition-all transform hover:scale-105 shadow-2xl">
                  <i className="fas fa-arrow-up mr-2"></i>
                  Obtenir mon devis maintenant
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

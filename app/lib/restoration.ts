import axios from "axios";

interface MenuItem {
    pole: string;
    accompagnement: string;
    periode: string;
    nom: string;
    info1: string;
    info2: string;
}

interface MenuData {
    grilladesMidi: string[];
    migrateurs: string[];
    cibo: string[];
    accompMidi: string[];
    grilladesSoir: string;
    accompSoir: string;
}


export async function getRestoration(setRefreshing: (refreshing: boolean) => void): Promise<MenuData | undefined> {
    try {
        const targetUrl = 'https://toast-js.ew.r.appspot.com/coteresto?key=1ohdRUdCYo6e71aLuBh7ZfF2lc_uZqp9D78icU4DPufA';

        const response = await axios.get(targetUrl);
        const data = response.data;

        const regex = /var loadingData = (\[.*?])/;
        const match = data.match(regex);
        const loadingData = match ? match[1] : 'Valeur non trouvée';
        const json: MenuItem[] = JSON.parse(loadingData.substring(1));

        const newMenuData: MenuData = {
            grilladesMidi: [],
            migrateurs: [],
            cibo: [],
            accompMidi: [],
            grilladesSoir: '',
            accompSoir: ''
        };

        json.forEach((objet: MenuItem) => {
            switch (objet.pole) {
                case 'Grillades / Plats traditions':
                    if (objet.accompagnement === "TRUE") {
                        if (objet.periode === "midi") {
                            const item = `${objet.nom} ${objet.info1}${objet.info2}`;
                            if (!newMenuData.accompMidi.includes(item)) {
                                newMenuData.accompMidi.push(item);
                            }
                        } else {
                            newMenuData.accompSoir += `${objet.nom}\n- ${objet.info1}${objet.info2}`;
                        }
                    } else {
                        if (objet.periode === "midi") {
                            newMenuData.grilladesMidi.push(`${objet.nom} ${objet.info1}${objet.info2}`);
                        } else {
                            newMenuData.grilladesSoir += `${objet.nom}${objet.info1}${objet.info2}`;
                        }
                    }
                    break;
                case 'Les Cuistots migrateurs':
                    if (objet.accompagnement === "TRUE") {
                        if (objet.periode === "midi") {
                            const item = `${objet.nom} ${objet.info1}${objet.info2}`;
                            if (!newMenuData.accompMidi.includes(item)) {
                                newMenuData.accompMidi.push(item);
                            }
                        } else {
                            newMenuData.accompSoir += `${objet.nom}\n- ${objet.info1}${objet.info2}`;
                        }
                    } else {
                        newMenuData.migrateurs.push(`${objet.nom} ${objet.info1}${objet.info2}`);
                    }
                    break;
                case 'Le Végétarien':
                    if (objet.accompagnement === "TRUE") {
                        if (objet.periode === "midi") {
                            const item = `${objet.nom} ${objet.info1}${objet.info2}`;
                            if (!newMenuData.accompMidi.includes(item)) {
                                newMenuData.accompMidi.push(item);
                            }
                        } else {
                            newMenuData.accompSoir += `${objet.nom} ${objet.info1}${objet.info2}`;
                        }
                    } else {
                        newMenuData.cibo.push(`${objet.nom} ${objet.info1}${objet.info2}`);
                    }
                    break;
            }
        });

        setRefreshing(false);

        return newMenuData;
    } catch (err) {
        console.error('Error while getting the menu :', err);
        setRefreshing(false);
    } finally {
        setRefreshing(false);
    }
}

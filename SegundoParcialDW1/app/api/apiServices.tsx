const baseURL = "http://161.35.143.238:8000/mcostanian";

export interface Team {
    id: string;
    name: string;
    description: string;
    points: number;
    goals: number;
    logo: string;
}


export const getTeams = async () => {
    try {
        const response = await fetch(baseURL);
        if (response.ok) {
            const teams = await response.json();
            console.log("Datos de la API:", teams);
            return teams;
        } else {
            console.log("Error getting teams");
            return [];
        }
    } catch (error) {
        console.error("Error de red:", error);
        return [];
    }
};


export const getTeamById = async (id: string) => {
    try {
        const response = await fetch(`${baseURL}/${id}`);
        if (response.ok) {
            const team = await response.json();
            return team;
        } else {
            console.log("Error getting team details");
            return null;
        }
    } catch (error) {
        console.error("Error de red:", error);
        return null;
    }
};


export const addTeam = async (team: Team) => {
    try {
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(team),
        });

        if (response.ok) {
            console.log('Team added successfully');
            return true;
        } else {
            console.log('Error adding team');
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return false;
    }
};


export const deleteTeamById = async (id: string) => {
    try {
        const response = await fetch(`${baseURL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Team deleted successfully');
            return true;
        } else {
            console.log('Error deleting team');
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return false;
    }
};


export const updateTeam = async (id: string, updatedTeam: Team) => {
    try {
        const response = await fetch(`${baseURL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTeam),
        });

        if (response.ok) {
            console.log('Team updated successfully');
            return true;
        } else {
            console.log('Error updating team');
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return false;
    }
};

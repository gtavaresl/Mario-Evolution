import random
import string

class DNA:

	def __init__(self, tamanho_pal):
		print("criou")
		self.gene=""
		for _ in range(tamanho_pal):
			self.gene += (str(unichr(random.randint(96,122))))

	def fitness(self):
		pontuacao = 0
		for i in range(tamanho_pal):
			if(self.gene[i] == texto_alvo[i]):
				pontuacao += 1
		self.fitness = float((pontuacao)/tamanho_pal)

	def crossover(self, pai2):
		ponto_de_corte = random.randint(0, tamanho_pop-1)
		for i in range(tamanho_pal):
			if (i>ponto_de_corte):
				# filho.gene[i] = self.gene[i]
				filho.gene[i].replace(filho.gene[i], self.gene[i])
			else:
				filho.gene[i].replace(filho.gene[i], self.gene[i])
				# filho.gene[i] = pai2.gene[i]

		return filho

	def mutacao(self, taxa_mutacao):
		for i in range(tamanho_pal):
			if(random.uniform(0, 1) < taxa_mutacao): #Gera um float aleatorio nesse range
				self.gene[i].replace(self.gene[i], (str(unichr(random.randint(96,122))))) 


	def imprimir_pal(self):
		return "".join(self.gene)



# FUNCOES

def setup():
	for i in range(tamanho_pop):
		populacao.append(DNA(tamanho_pal))	

def calcular_fitness():
	for i in range(tamanho_pop):
		populacao[i].fitness()

def criar_pool():
	for i in range(tamanho_pop):
		# print("aqui")
		qtd = int(populacao[i].fitness*100)
		for j in range(qtd):
			# print("aka")
			pool.append(populacao[i])

def cruzar():
	for i in range(tamanho_pop):
		a = random.randint(0, tamanho_pop-1)
		b = random.randint(0, tamanho_pop-1)
		pai1 = populacao[a]
		pai2 = populacao[b]
		filho = pai1.crossover(pai2)
		filho.mutacao(taxa_mutacao)
		populacao[i] = filho 

# Globais
texto_alvo = 'SerOuNaoSer'
populacao = []
tamanho_pop = 10000
taxa_mutacao = 0.01
tamanho_pal = len(texto_alvo)
i = 0
pool = []
filho = DNA(tamanho_pal)


#MAIN
if __name__ == '__main__':
	texto_alvo = list(texto_alvo)
	setup()
	calcular_fitness()

	for i in range(tamanho_pop):
		print("Antes " + str(i) +" - " + populacao[i].imprimir_pal() + " - pontuacao " + str(populacao[i].fitness))

	criar_pool()
	cruzar()
	# for i in range(tamanho_pop):
	# 	print("Depois " + str(i) +" - " + populacao[i].imprimir_pal())

